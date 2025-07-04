"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Moon, SearchIcon, Sun, X } from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";
import { AuthProvider } from "@/providers/AuthProvider";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip } from "./ui/Tooltip";

const Navbar = () => {
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme("dark");
      document.body.classList.add("dark");
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

  const goToSearchPage = () => {
    if (query) {
      router.push(`/search/${query}`);
    }
  };

  useEffect(() => {
    const searchInput = searchInputRef.current;
    if (searchInput) {
      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          goToSearchPage();
        }
      };
      searchInput.addEventListener("keydown", handleKeyDown);

      return () => {
        searchInput.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [query]);

  return (
    <AuthProvider>
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-slate-100 px-4 py-2 dark:bg-slate-800">
        <Tooltip text="Sheets Home" className="z-20 -translate-y-3">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/navbar-icon.png"
                alt="Logo"
                width={40}
                height={40}
                className="size-7"
              />
              <span className="ml-4 font-mono text-lg font-bold tracking-widest text-teal-900 dark:text-teal-200">
                Goggle Sheets
              </span>
            </Link>
          </div>
        </Tooltip>

        <div className="relative w-2/6 max-w-3xl">
          <div className="relative flex w-full items-center">
            <Input
              type="text"
              id="searchInput"
              ref={searchInputRef}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 400)}
              autoComplete="off"
              className="h-full w-full rounded-full border border-gray-400 bg-teal-50 px-12 py-2 text-lg shadow-teal-300/40 transition-all placeholder:align-baseline placeholder:text-sm placeholder:leading-none focus:border-teal-700 focus:ring-teal-500 focus:drop-shadow-lg focus-visible:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:shadow-teal-600/60"
            />
            <div className="absolute left-3 flex items-center">
              <Tooltip text="Search" className="z-20 -translate-y-3">
                {!query && (
                  <SearchIcon className="h-6 w-6 text-teal-600 dark:text-gray-400" />
                )}
                {query && (
                  <button onClick={goToSearchPage}>
                    <SearchIcon className="h-6 w-6 text-teal-600 !transition-none hover:text-teal-800 dark:text-gray-400 dark:hover:text-gray-100" />
                  </button>
                )}
              </Tooltip>
            </div>

            {query && (
              <Tooltip text="Clear Search" className="z-20 -translate-y-5">
                <button onClick={clearSearch} className="absolute right-4">
                  <X className="h-6 w-6 text-gray-500 !transition-none hover:text-red-500" />
                </button>
              </Tooltip>
            )}
          </div>

          {query && isSearchFocused && (
            <div className="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-lg bg-teal-50 p-4 shadow-lg dark:bg-gray-800">
              {isSheetsFetchLoading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <div
                    key={item.spreadsheet_id}
                    className="flex cursor-pointer items-center justify-between border-b px-4 py-3 hover:bg-teal-100 dark:hover:bg-slate-900/50"
                  >
                    <div
                      className="flex flex-1 items-center gap-4"
                      onClick={() =>
                        router.push(`/sheets/${item.spreadsheet_id}`)
                      }
                    >
                      <Image
                        src="/assets/images/sheets-icon.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="size-5"
                      />
                      <div className="flex flex-col">
                        <span className="max-w-[40ch] truncate font-semibold text-gray-900 dark:text-gray-100">
                          {item.spreadsheet_name}
                        </span>
                        <span className="max-w-[50ch] truncate text-sm font-light text-gray-700 dark:text-gray-200">
                          {item.owner_name}
                        </span>
                      </div>
                      <span className="ml-auto text-sm font-light text-gray-700 dark:text-gray-300">
                        {(() => {
                          const editedDate = new Date(item.last_edited_at);
                          const today = new Date();

                          const isToday =
                            editedDate.getDate() === today.getDate() &&
                            editedDate.getMonth() === today.getMonth() &&
                            editedDate.getFullYear() === today.getFullYear();

                          return isToday
                            ? editedDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : editedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              });
                        })()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No results found.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          <Tooltip
            text={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            <Button
              onClick={toggleTheme}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-0 transition-all duration-300 hover:bg-gray-500 dark:bg-gray-100 dark:hover:bg-gray-300"
            >
              {theme === "light" ? (
                <Moon className="size-6 text-white transition-all duration-300" />
              ) : (
                <Sun className="size-6 text-black transition-all duration-300" />
              )}
            </Button>
          </Tooltip>

          <ProfileMenu />
        </div>
      </nav>
    </AuthProvider>
  );
};

export default Navbar;
