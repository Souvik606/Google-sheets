"use client";

import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  EditIcon,
  MoreVertical,
  RefreshCw,
  SquareArrowOutUpRight,
  Trash2Icon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/AuthProvider";

const SearchPage = () => {
  const [ownerFilter, setOwnerFilter] = useState("anyone");
  const { query } = useParams();
  const decodedQuery = decodeURIComponent(query);
  const router = useRouter();
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const userId = auth.user.user_id;

  const {
    data: sheets,
    isLoading: isSheetsFetchLoading,
    isSuccess: isSheetsFetched,
    isFetching: isSheetsFetching,
    refetch,
    error,
  } = useQuery({
    queryFn: async () => {
      const response = await api.get(
        `/spreadsheet/search?query=${decodedQuery}&page=${currentPage}`
      );
      return response.data;
    },
    queryKey: ["searchSpreadsheetsByNames", decodedQuery, currentPage],
    keepPreviousData: true,
  });

  const { data: searchCount } = useQuery({
    queryFn: async () => {
      const response = await api.get(
        `/spreadsheet/count?query=${decodedQuery}`
      );
      return response.data.data;
    },
    queryKey: ["getSpreadsheetCount", decodedQuery],
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching search results:", error);
    }
  }, [error]);

  return (
    <>
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex items-center justify-between pb-8 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-bold">Search results: {decodedQuery}</h2>
        </div>
        <div className="flex items-center bg-teal-50 px-4 py-1 text-lg text-gray-600 dark:bg-slate-800/50 dark:text-gray-400">
          <span className="flex-1 font-semibold">Name</span>
          <span className="w-1/4 font-semibold">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="cursor-pointer rounded-lg px-0 py-2 font-semibold focus:outline-none"
            >
              <option value="anyone">Owned by anyone</option>
              <option value="me">Owned by me</option>
              <option value="not-me">Not owned by me</option>
            </select>
          </span>
          <span className="w-1/4 font-semibold">Last edited</span>
          <button
            onClick={() => refetch()}
            className="cursor-pointer rounded-full px-0.5"
          >
            <RefreshCw
              className={`size-5 !transition-none hover:text-green-700 ${
                isSheetsFetching && "animate-spin"
              }`}
            />
          </button>
        </div>
        <div>
          {isSheetsFetchLoading ? (
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : error ? (
            <p className="text-lg text-red-500 dark:text-red-400">
              Failed to load search results.
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
                      length: Math.ceil(searchCount / 20),
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
                            Math.min(prev + 1, Math.ceil(searchCount / 20))
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
    </>
  );
};

export default SearchPage;
