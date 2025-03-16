"use client";

import React from "react";
import ReactQueryProvider from "@/providers/ReactQueryClientProvider";

const AuthLayout = ({ children }) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};
export default AuthLayout;
