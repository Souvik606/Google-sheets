"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Moon, SearchIcon, Sun } from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";
import { AuthProvider } from "@/providers/AuthProvider";
import Image from "next/image";

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
      <nav className="sticky top-0 flex items-center justify-between bg-slate-100 px-4 py-2 dark:bg-slate-700">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/sheets-icon.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <span className="ml-2 font-mono text-xl font-bold text-teal-900 dark:text-teal-200">
              Goggle Sheets
            </span>
          </Link>
        </div>

        <div className="relative w-2/5 max-w-3xl">
          <Input
            type="text"
            placeholder="Search..."
            className="h-14 w-full rounded-full border border-gray-400 bg-teal-50 py-2 pr-4 pl-12 text-xl shadow-teal-300/40 drop-shadow-lg placeholder:text-xl focus:border-teal-700 focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:shadow-teal-600/60"
          />
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <SearchIcon className="h-6 w-6 text-teal-600 dark:text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-all duration-300 hover:bg-gray-500 dark:bg-gray-100 dark:hover:bg-gray-300"
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
