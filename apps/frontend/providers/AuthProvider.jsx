"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader } from "lucide-react";

const UserAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
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
        JSON.stringify({ isAuthenticated: true, user })
      );
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        "Login failed: " + error.response?.data?.message || "Unexpected error"
      );
    }
  };

  const signup = async ({ profileIcon, name, email, password }) => {
    const formData = new FormData();

    if (profileIcon) {
      formData.append("profileIcon", profileIcon);
    }

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = response.data.data;
      setAuth({
        isAuthenticated: true,
        loading: false,
        user: user,
      });

      localStorage.setItem(
        "auth",
        JSON.stringify({ isAuthenticated: true, user })
      );
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw new Error(
        "Login failed: " + error.response?.data?.message || "Unexpected error"
      );
    }
  };

  const logout = async (shouldRedirect = false) => {
    try {
      await api.delete(`/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }

    if (shouldRedirect) {
      const newAuthState = {
        isAuthenticated: false,
        loading: false,
        user: null,
      };

      setAuth(newAuthState);
      localStorage.removeItem("auth"); // Remove existing auth data
      localStorage.setItem("auth", JSON.stringify(newAuthState)); // Store updated auth state

      router.push(`/login`);
    }
  };

  // Check login status on initial load
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (!storedAuth?.isAuthenticated) {
      setAuth({ isAuthenticated: false, loading: false, user: null });
      router.push("/login");
    } else {
      setAuth({ ...storedAuth, loading: false });
      setTimeout(() => redirect("/"), 500);
    }
  }, [router]);

  return (
    <UserAuthContext.Provider value={{ auth, login, logout, signup }}>
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
