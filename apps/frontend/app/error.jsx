"use client";

import React from "react";

const ErrorPage = ({ error }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 py-10">
      <h1 className="text-xl font-black md:text-7xl">
        Oops! Something went wrong.
      </h1>
      <h2 className="text-lg text-zinc-700">
        We are already on it. Please come back later.
      </h2>
    </div>
  );
};
export default ErrorPage;
