"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { CircleAlertIcon, CircleCheckIcon, PlusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { redirect } from "next/dist/server/api-utils";
import api from "@/lib/api";

const dummyData = [
  {
    spreadsheet_id: 1,
    spreadsheet_name: "2025 Election Results",
    owner_id: "election commissioner",
    last_edited_at: "Mar 16, 2025",
  },
  {
    spreadsheet_id: 2,
    spreadsheet_name: "MPP Lab Teams",
    owner_id: "anyone",
    last_edited_at: "Mar 16, 2025",
  },
  {
    spreadsheet_id: 3,
    spreadsheet_name: "Mavuika Damage Calcs",
    owner_id: "me",
    last_edited_at: "Mar 16, 2025",
  },
  {
    spreadsheet_id: 4,
    spreadsheet_name: "Attendance",
    owner_id: "me",
    last_edited_at: "Feb 19, 2025",
  },
  {
    spreadsheet_id: 5,
    spreadsheet_name: "Code Combat Registration Form (Responses)",
    owner_id: "me",
    last_edited_at: "Feb 19, 2025",
  },
  {
    spreadsheet_id: 6,
    spreadsheet_name: "CSE 2022-26",
    owner_id: "Arkopravo Saha",
    last_edited_at: "Jan 16, 2025",
  },
  {
    spreadsheet_id: 7,
    spreadsheet_name: "balls",
    owner_id: "me",
    last_edited_at: "Jan 25, 2025",
  },
];

export default function Home() {
  const {
    mutate: createSheet,

    isPending,
  } = useMutation({
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
      console.log(err);
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
      <section className={"mx-auto max-w-7xl px-2 py-4 2xl:px-0"}>
        <h2
          className={"text-lg font-semibold text-gray-600 dark:text-gray-400"}
        >
          Start a new sheet
        </h2>
        <div className={"flex items-center gap-3 py-3"}>
          <Button
            onClick={(data) => createSheet(data)}
            disabled={isPending}
            className={
              "flex aspect-square w-40 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-gradient-to-br from-teal-50 to-teal-100 hover:border-teal-200 hover:to-teal-300 dark:border-gray-600 dark:from-teal-900 dark:to-gray-800 dark:hover:border-gray-500 dark:hover:from-black dark:hover:to-gray-700"
            }
          >
            <PlusIcon
              strokeWidth={2}
              size={100}
              className={"text-teal-800/70 dark:text-teal-200/70"}
            />
          </Button>
        </div>
      </section>

      <section className={"mx-auto max-w-7xl px-2 py-4 2xl:px-0"}>
        <div className="flex items-center justify-between">
          <h2
            className={"text-lg font-semibold text-gray-600 dark:text-gray-400"}
          >
            My sheets
          </h2>
          <div></div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-slate-800">
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead>
                <Select>
                  <SelectTrigger
                    size={"default"}
                    className={
                      "cursor-pointer border-none bg-transparent p-0 shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:ring-0 dark:bg-transparent"
                    }
                  >
                    <SelectValue placeholder="Owned by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="anyone">Owned by anyone</SelectItem>
                      <SelectItem value="me">Owned by me</SelectItem>
                      <SelectItem value="not-me">Not owned by me</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead>Last edited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-gray-200 dark:hover:bg-gray-900">
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
              </TableRow>
            ) : (
              isSuccess &&
              sheets.data.map((item) => (
                <TableRow
                  className="hover:bg-gray-200 dark:hover:bg-gray-900"
                  key={item.spreadsheet_id}
                >
                  <TableCell>{item.spreadsheet_name}</TableCell>
                  <TableCell>{item.owner_id}</TableCell>
                  <TableCell>{item.last_edited_at}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
