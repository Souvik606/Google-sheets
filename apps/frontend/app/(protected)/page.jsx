import Navbar from "@/components/Navbar";
import React from "react";
import { PlusIcon } from "lucide-react";

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

const tableData = [
  {
    groupName: "Yesterday",
    items: [
      {
        name: "Monthly Expenses 2025",
        ownedBy: "me",
        lastOpened: "Mar 16, 2025",
      },
      {
        name: "MPP Lab Teams",
        ownedBy: "me",
        lastOpened: "Mar 16, 2025",
      },
      {
        name: "Mini Project_6th_sem_2024",
        ownedBy: "Ninja Hattori",
        lastOpened: "Mar 16, 2025",
      },
    ],
  },
  {
    groupName: "Previous 30 days",
    items: [
      {
        name: "Attendance",
        ownedBy: "me",
        lastOpened: "Feb 19, 2025",
      },
      {
        name: "Code Conduct Registration Form (Responses)",
        ownedBy: "me",
        lastOpened: "Feb 19, 2025",
      },
    ],
  },
  {
    groupName: "Earlier",
    items: [
      {
        name: "Due of post Boarders (Mess)_2022",
        ownedBy: "Arnab",
        lastOpened: "Jan 16, 2025",
      },
      {
        name: "REF 2025 Payment sheet.xlsx",
        ownedBy: "me",
        lastOpened: "Dec 29, 2024",
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* New Spreadsheet */}
      <section className={"mx-auto max-w-7xl px-2 py-4 2xl:px-0"}>
        <h2 className={"text-lg font-semibold text-gray-600"}>
          Start a new sheet
        </h2>
        <div className={"flex items-center gap-3 py-3"}>
          <Button
            className={
              "flex aspect-square w-40 cursor-pointer items-center justify-center rounded-lg border border-gray-400 bg-gradient-to-br from-teal-50 to-teal-100 hover:border-teal-200 hover:to-teal-300"
            }
          >
            <PlusIcon
              strokeWidth={2}
              size={100}
              className={"text-teal-800/70"}
            />
          </Button>
        </div>
      </section>

      <section className={"mx-auto max-w-7xl px-2 py-4 2xl:px-0"}>
        <div className="flex items-center justify-between">
          <h2 className={"text-lg font-semibold text-gray-600"}>My sheets</h2>
          <div></div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead>
                <Select>
                  <SelectTrigger
                    size={"default"}
                    className={
                      "cursor-pointer border-none p-0 shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:ring-0"
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
              <TableHead>Last opened by me</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((section) =>
              section.items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.ownedBy}</TableCell>
                  <TableCell>{item.lastOpened}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
