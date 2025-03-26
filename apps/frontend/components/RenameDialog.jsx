"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

export function RenameSpreadsheetDialog({
  open,
  onOpenChange,
  initialName,
  sheetId,
  onRenameSuccess,
}) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleRename = () => {
    renameSpreadSheet({ spreadSheetId: sheetId, name });
    onOpenChange(false);
  };

  const { mutate: renameSpreadSheet, isPending: isSpreadSheetRenamePending } =
    useMutation({
      mutationFn: async ({ spreadSheetId, name }) => {
        const response = await api.patch(
          `/spreadsheet/${spreadSheetId}/rename`,
          {
            name,
          }
        );
        return response.data;
      },
      mutationKey: ["RenameSpreadSheet", initialName, sheetId],
      onSuccess: (res) => {
        toast(res.message, {
          icon: <CircleCheckIcon className="text-emerald-500" />,
          dismissible: true,
        });
        onRenameSuccess();
      },
      onError: (err) => {
        toast(err.response ? err.response.data.message : err.message, {
          icon: <CircleAlertIcon className="text-rose-500" />,
          dismissible: true,
        });
      },
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Spreadsheet</DialogTitle>
          <DialogDescription>
            Enter a new name for your spreadsheet.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New spreadsheet name"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleRename}
            className={
              "cursor-pointer bg-teal-800 hover:bg-teal-900 dark:bg-teal-50 dark:hover:bg-teal-200"
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
