"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader } from "lucide-react";

const UserAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
    userType: null,
  });

  const router = useRouter();

  // Log in function
  const login = async (credentials) => {
    try {
      const response = await api.post(`/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const user = response.data.data;
      setAuth({
        isAuthenticated: true,
        loading: false,
        user: user,
      });

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          user: user,
        })
      );

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        "Login failed: " + error.response?.data?.message || "Unexpected error"
      );
    }
  };

  // Log out function
  const logout = async (shouldRedirect = true) => {
    try {
      await api.delete(`/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }

    setAuth({ isAuthenticated: false, loading: false, user: null });
    localStorage.removeItem("auth");

    if (shouldRedirect) {
      router.push(`/login`);
    }
  };

  // Check login status on initial load
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));

    if (storedAuth?.isAuthenticated) {
      setAuth({ ...storedAuth, loading: false });
    } else {
      // If no auth data in localStorage, set loading to false and redirect to login
      setAuth({ isAuthenticated: false, loading: false, user: null });
    }
  }, [router]);

  return (
    <UserAuthContext.Provider value={{ auth, login, logout }}>
      {auth.loading ? (
        <div className={"flex min-h-screen items-center justify-center"}>
          <Loader className={"animate-spin"} />
        </div>
      ) : (
        children
      )}
    </UserAuthContext.Provider>
  );
};

export const useAuth = () => useContext(UserAuthContext);
