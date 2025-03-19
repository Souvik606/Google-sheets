"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";


const UserAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true,
    user: null
  });

  const router = useRouter();

  // Log in function
  const login = async (credentials) => {
    try {
      const response = await api.post(`/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("response=", response.data.data);
      const user = response.data.data;
      const tempAuth={
        isAuthenticated: true,
        loading: false,
        user: user
      };
      setAuth(tempAuth);

      localStorage.setItem(
        "auth",
        JSON.stringify(tempAuth)
      );
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        "Login failed: " + error.response?.data?.message || "Unexpected error"
      );
    }
  };

  const logout = async (shouldRedirect = false) => {
    try {
      const response = await api.delete(`/auth/logout`);
      
      if (response.status === 200) {
        console.log('Logged Out Successfully!');
        shouldRedirect = true;
      }
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }
  
    if (shouldRedirect) {
      const newAuthState = { isAuthenticated: false, loading: false, user: null };
      
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
    <UserAuthContext.Provider value={{ auth, login, logout }}>
    {auth.loading ? (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin"  size={36} />
      </div>
    ) : (
      children
    )}
  </UserAuthContext.Provider>  
  );
};

export const useAuth = () => useContext(UserAuthContext);
