import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <div className="flex min-h-screen items-center bg-gradient-to-br from-purple-300 to-teal-300 px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-black md:text-7xl">
              Oops! Lost in Cyberspace
            </h1>
            <p className="text-xl font-semibold text-gray-700">
              Looks like you've ventured into the unknown digital realm.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:ring-1 focus-visible:ring-gray-950 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            Return to website
          </Link>
        </div>
      </div>
    </>
  );
};
export default NotFound;
