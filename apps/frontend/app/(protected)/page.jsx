"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  EditIcon,
  MoreVertical,
  Plus,
  RefreshCw,
  SquareArrowOutUpRight,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationRowsPerPage,
} from "@/components/ui/pagination";

import { RenameSpreadsheetDialog } from "@/components/RenameDialog";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Tooltip } from "@/components/ui/Tooltip";

export default function Home() {
  const [ownerFilter, setOwnerFilter] = useState("anyone");
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();
  const { auth } = useAuth();

  const userId = auth.user.user_id;

  const { mutate: createSheet, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.post("/spreadsheet/create");
      return response.data;
    },
    mutationKey: ["CreateSheet"],
    onSuccess: (res) => {
      toast(res.message, {
        icon: <CircleCheckIcon className="text-emerald-500" />,
        dismissible: true,
      });
      refetch();
    },
    onError: (err) => {
      toast(err.response ? err.response.data.message : err.message, {
        icon: <CircleAlertIcon className="text-rose-500" />,
        dismissible: true,
      });
    },
  });

  const {
    data: sheets,
    isLoading: isSheetsFetchLoading,
    isSuccess: isSheetsFetched,
    isFetching: isSheetsFetching,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const response = await api.get("/spreadsheet");
      return response.data;
    },
    queryKey: ["GetAllSheets"],
  });

  const { mutate: deleteSpreadSheet, isPending: isSpreadSheetDeletePending } =
    useMutation({
      mutationFn: async ({ spreadSheetId }) => {
        const response = await api.delete(
          `/spreadsheet/${spreadSheetId}/delete`
        );
        return response.data;
      },
      mutationKey: ["DeleteSpreadSheet"],
      onSuccess: (res) => {
        toast(res.message, {
          icon: <CircleCheckIcon className="text-emerald-500" />,
          dismissible: true,
        });
        refetch();
      },
      onError: (err) => {
        toast(err.response ? err.response.data.message : err.message, {
          icon: <CircleAlertIcon className="text-rose-500" />,
          dismissible: true,
        });
      },
    });

  return (
    <>
      <Navbar />

      {/* New Spreadsheet */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <h2 className="text-center text-xl font-bold text-gray-800 dark:text-gray-200">
          Start a new spreadsheet
        </h2>
        <div className="flex items-center justify-center pt-3">
          <Button
            onClick={createSheet}
            disabled={isPending}
            className="flex h-35 w-45 cursor-pointer items-center justify-center rounded-sm border-2 bg-white text-teal-700 shadow-md !transition-none hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 hover:shadow-lg dark:border-gray-700 dark:bg-zinc-800 dark:text-cyan-500 dark:hover:border-teal-50/70 dark:hover:bg-zinc-900 dark:hover:text-cyan-300"
          >
            <Plus className="size-10 h-3/4 w-3/4 object-contain !transition-none hover:text-cyan-300" />
          </Button>
        </div>
      </section>

      {/* Sheets List */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between pb-8 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-bold">My Sheets</h2>
        </div>
        <div className="flex items-center bg-teal-50 px-4 py-1 text-lg text-gray-600 dark:bg-slate-800/50 dark:text-gray-400">
          <span className="flex-1 font-semibold">Name</span>
          <span className="w-1/4 font-semibold">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="cursor-pointer rounded-lg px-0 py-2 font-semibold focus:outline-none"
            >
              <option
                value="anyone"
                className="dark:focus-visible::bg-slate-800 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-slate-800 dark:focus:text-white"
              >
                Owned by anyone
              </option>
              <option
                value="me"
                className="dark:focus-visible::bg-slate-800 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-slate-800 dark:focus:text-white"
              >
                Owned by me
              </option>
              <option
                value="not-me"
                className="dark:focus-visible::bg-slate-800 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-slate-800 dark:focus:text-white"
              >
                Not owned by me
              </option>
            </select>
          </span>
          <span className="w-1/4 font-semibold">Last edited</span>
          <Tooltip text="Refresh" className="z-20 -translate-y-3">
            <button
              onClick={() => refetch()}
              className="cursor-pointer rounded-full px-0.5"
            >
              <RefreshCw
                className={`size-5 !transition-none hover:text-green-700 ${isSheetsFetching && "animate-spin"}`}
              />
            </button>
          </Tooltip>
        </div>
        <div>
          {isSheetsFetchLoading ? (
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : (
            isSheetsFetched && (
              <>
                {sheets.data
                  .filter((sheet) => {
                    if (ownerFilter === "me") {
                      return sheet.owner_id === userId;
                    } else if (ownerFilter === "not-me") {
                      return sheet.owner_id !== userId;
                    }
                    return true;
                  })
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((item) => (
                    <div
                      key={item.spreadsheet_id}
                      className="flex cursor-pointer items-center justify-between border-b px-4 py-5 hover:bg-gray-100 dark:hover:bg-slate-900/50"
                    >
                      <div
                        className="flex flex-1 items-center gap-6"
                        onClick={() =>
                          router.push(`/sheets/${item.spreadsheet_id}`)
                        }
                      >
                        <Image
                          src="/assets/images/sheets-icon.png"
                          alt="Logo"
                          width={40}
                          height={40}
                          className="size-5"
                        />
                        <span className="w-2/3 max-w-[50ch] truncate font-semibold text-gray-900 dark:text-gray-100">
                          {item.spreadsheet_name}
                        </span>
                      </div>
                      <span className="w-1/4 max-w-[50ch] truncate pl-1 font-medium text-gray-700 dark:text-gray-300">
                        {item.owner_id === userId ? "me" : item.owner_name}
                      </span>
                      <span className="w-1/4 font-medium text-gray-700 dark:text-gray-300">
                        {(() => {
                          const editedDate = new Date(item.last_edited_at);
                          const today = new Date();
                          const isToday =
                            editedDate.getDate() === today.getDate() &&
                            editedDate.getMonth() === today.getMonth() &&
                            editedDate.getFullYear() === today.getFullYear();
                          return isToday
                            ? editedDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : editedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              });
                        })()}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="cursor-pointer text-gray-500 transition-none hover:text-zinc-800 focus-visible:outline-none dark:hover:text-zinc-200" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setInitialName(item.spreadsheet_name);
                              setSelectedSpreadsheetId(item.spreadsheet_id);
                              setShowRenameDialog(true);
                            }}
                          >
                            <EditIcon />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              deleteSpreadSheet({
                                spreadSheetId: item.spreadsheet_id,
                              })
                            }
                          >
                            <Trash2Icon />
                            <span>Delete</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              window.open(
                                `/sheets/${item.spreadsheet_id}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <SquareArrowOutUpRight />
                            <span>Open in new tab</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                <Pagination className="mt-4">
                  <PaginationRowsPerPage
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    className="mr-2"
                  />
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(
                        sheets.data.filter((sheet) => {
                          if (ownerFilter === "me") {
                            return sheet.owner_id === userId;
                          } else if (ownerFilter === "not-me") {
                            return sheet.owner_id !== userId;
                          }
                          return true;
                        }).length / rowsPerPage
                      ),
                    }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={index + 1 === currentPage}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(
                                sheets.data.filter((sheet) => {
                                  if (ownerFilter === "me") {
                                    return sheet.owner_id === userId;
                                  } else if (ownerFilter === "not-me") {
                                    return sheet.owner_id !== userId;
                                  }
                                  return true;
                                }).length / rowsPerPage
                              )
                            )
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )
          )}
        </div>
      </section>

      <RenameSpreadsheetDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        initialName={initialName}
        sheetId={selectedSpreadsheetId}
        onRenameSuccess={refetch}
      />
    </>
  );
}
