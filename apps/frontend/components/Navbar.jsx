"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Moon, SearchIcon, Sun, X } from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";
import { AuthProvider } from "@/providers/AuthProvider";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const {
    data: sheets,
    isLoading: isSheetsFetchLoading,
    isSuccess: isSheetsFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const response = await api.get("/spreadsheet");
      return response.data;
    },
    queryKey: ["GetAllSheets"],
  });

  useEffect(() => {
    if (!query.trim() || !isSheetsFetched) {
      setFilteredResults([]);
      return;
    }

    const filtered = sheets.data.filter(
      (sheet) =>
        sheet.spreadsheet_name.toLowerCase().includes(query.toLowerCase()) ||
        sheet.owner_name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredResults(filtered);
  }, [query, sheets, isSheetsFetched]);

  const clearSearch = () => {
    setQuery("");
    setFilteredResults([]);
  };

  return (
    <AuthProvider>
      <nav className="sticky top-0 flex items-center justify-between bg-slate-100 px-4 py-2 dark:bg-slate-800">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/app-icons/android-chrome-192x192.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <span className="ml-2 font-mono text-xl font-bold tracking-widest text-teal-900 dark:text-teal-200">
              Goggle Sheets
            </span>
          </Link>
        </div>

        <div className="relative w-2/5 max-w-3xl">
          <div className="relative flex w-full items-center">
            <Input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 400)}
              className="h-full w-full rounded-full border border-gray-400 bg-teal-50 px-12 py-3 text-xl shadow-teal-300/40 transition-all placeholder:translate-y-0.5 placeholder:align-baseline placeholder:text-lg placeholder:leading-none focus:border-teal-700 focus:ring-teal-500 focus:drop-shadow-lg focus-visible:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:shadow-teal-600/60"
            />
            <div className="pointer-events-none absolute left-4 flex items-center">
              <SearchIcon className="h-6 w-6 text-teal-600 dark:text-gray-400" />
            </div>
            {query && (
              <button onClick={clearSearch} className="absolute right-4">
                <X className="h-6 w-6 text-gray-500 !transition-none hover:text-red-500" />
              </button>
            )}
          </div>

          {query && isSearchFocused && (
            <div className="absolute z-10 mt-2 w-full rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              {isSheetsFetchLoading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <p key={index}>{item.spreadsheet_name}</p>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No results found.
                </p>
              )}
            </div>
          )}
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
