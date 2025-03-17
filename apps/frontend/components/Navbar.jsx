import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex items-center justify-between bg-white px-4 py-3">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center">
          <img
            src="/app-icons/android-chrome-192x192.png"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="ml-2 font-mono text-xl font-bold text-teal-900">
            Sheets
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

      <ProfileMenu />
    </nav>
  );
};

export default Navbar;
