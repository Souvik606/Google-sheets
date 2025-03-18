"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SearchIcon, Moon, Sun } from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";
import { AuthProvider } from "@/providers/AuthProvider";

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme("light");
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <AuthProvider>
      <nav className="sticky top-0 flex items-center justify-between bg-slate-100 px-4 py-3 dark:bg-slate-700">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <img
              src="/app-icons/android-chrome-192x192.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 font-mono text-xl font-bold text-teal-900 dark:text-teal-200">
              Goggle Sheets
            </span>
          </Link>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="h-10 rounded-full border-2 bg-teal-50 py-3 pr-4 pl-10 text-lg focus-visible:border-teal-700 lg:w-full"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 transition-all duration-300 dark:bg-gray-200"
          >
            {theme === "light" ? (
              <Moon className="h-6 w-6 text-white transition-all duration-300" />
            ) : (
              <Sun className="h-6 w-6 text-black transition-all duration-300" />
            )}
          </button>

          <ProfileMenu />
        </div>
      </nav>
    </AuthProvider>
  );
};

export default Navbar;
