"use client";

import React from "react";
import ReactQueryProvider from "@/providers/ReactQueryClientProvider";

const ProtectedLayout = ({ children }) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};
export default ProtectedLayout;
