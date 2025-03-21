"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 py-10">
      <h1 className="text-center text-xl font-black md:text-7xl">
        Oops! Something <br />
        went wrong.
      </h1>
      <h2 className="text-lg text-zinc-700">
        We are already on it. Please come back later.
      </h2>
      <h3 className={"font-mono text-rose-500 empty:hidden"}>
        {error.message}
      </h3>
      <div className={"flex gap-4"}>
        <Button
          className={
            "cursor-pointer bg-gray-800 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-gray-400"
          }
          onClick={() => reset()}
        >
          Try again
        </Button>
        <Link href={"/"}>
          <Button variant={"outline"} className={"cursor-pointer"}>
            Return to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
