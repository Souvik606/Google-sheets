import Navbar from "@/components/Navbar";
import React from "react";
import { PlusIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
        ownedBy: "Ankita Das",
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
        ownedBy: "Raushan Kumar",
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
        <div className="space-y-8">
          {tableData.map((section) => (
            <div key={section.groupName} className="space-y-2">
              {/* Section Heading (e.g. “Yesterday”, “Previous 30 days”) */}
              <h2 className="text-lg font-semibold text-gray-600 uppercase">
                {section.groupName}
              </h2>

              {/* Table for this section */}
              <Table>
                <TableBody>
                  {section.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.ownedBy}</TableCell>
                      <TableCell>{item.lastOpened}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
