"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated and not loading
      router.push("/login");
    }
  }, [auth, router]);

  if (auth.loading) return <p>Loading...</p>;

  // If authenticated, render the protected content
  return auth.isAuthenticated ? children : null;
};

export default ProtectedRoute;
