"use client";

import React from "react";
import ReactQueryProvider from "@/providers/ReactQueryClientProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoutes";

const ProtectedLayout = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ProtectedRoute>{children}</ProtectedRoute>
      </AuthProvider>
    </ReactQueryProvider>
  );
};
export default ProtectedLayout;
