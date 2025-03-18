"use client";

import React from "react";
import ReactQueryProvider from "@/providers/ReactQueryClientProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const AuthLayout = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
};
export default AuthLayout;
