"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { CircleAlertIcon, CircleCheckIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { redirect } from "next/dist/server/api-utils";
import api from "@/lib/api";
import Image from "next/image";

export default function Home() {
  const [ownerFilter, setOwnerFilter] = useState("anyone");

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
      redirect("/sheets/");
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
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      const response = await api.get("/spreadsheet");
      return response.data;
    },
    queryKey: ["CreateSheet"],
  });

  return (
    <>
      <Navbar />

      {/* New Spreadsheet */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Start a new spreadsheet
        </h2>
        <div className="flex items-center justify-center gap-6 py-6">
          <Button
            onClick={createSheet}
            disabled={isPending}
            className="flex h-44 w-52 cursor-pointer items-center justify-center rounded-2xl border-2 bg-white shadow-md hover:border-teal-300 hover:bg-teal-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-teal-50/70 dark:hover:bg-zinc-900"
          >
            <Image
              src="/app-icons/plus.png"
              alt="Create spreadsheet"
              width={140}
              height={140}
              className="h-3/4 w-3/4 object-contain"
            />
          </Button>
        </div>
      </section>

      {/* Sheets List */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between pb-8 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-bold">My Sheets</h2>
        </div>
        <div className="flex items-center px-4 py-2 text-lg text-gray-600 dark:bg-slate-800 dark:text-gray-400">
          <span className="flex-1 font-semibold">Name</span>
          <span className="w-1/4 font-semibold">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="cursor-pointer rounded-lg px-4 py-2 text-lg font-semibold focus:outline-none"
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
        </div>
        <div>
          {isLoading ? (
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : (
            isSuccess &&
            sheets.data.map((item) => (
              <div
                key={item.spreadsheet_id}
                className="flex cursor-pointer items-center justify-between border-b px-4 py-5 hover:bg-gray-100 dark:hover:bg-slate-900"
              >
                <div className="flex flex-1 items-center gap-4">
                  <Image
                    src="/app-icons/android-chrome-192x192.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="h-8 w-8"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.spreadsheet_name}
                  </span>
                </div>
                <span className="w-1/4 text-lg font-medium text-gray-700 dark:text-gray-300">
                  {item.owner_name}
                </span>
                <span className="w-1/4 pl-6 text-lg font-medium text-gray-700 dark:text-gray-300">
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
                <MoreVertical className="cursor-pointer text-gray-500 dark:text-gray-400" />
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
