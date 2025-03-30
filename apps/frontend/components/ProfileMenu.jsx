import { LogOut, Settings, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAuth } from "@/providers/AuthProvider";

export function ProfileMenu() {
  const { logout, auth } = useAuth();

  const profileIcon = auth?.user?.profile_icon;
  const name = auth?.user?.name;
  const email = auth?.user?.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Tooltip text={`${name}\n${email}`}>
            <Avatar className="size-8 cursor-pointer rounded-full">
              <AvatarImage
                src={profileIcon}
                alt={name}
                className="cursor-pointer transition-transform duration-300 hover:scale-110"
              />
              <AvatarFallback className="bg-teal-800/20 hover:text-teal-700">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-7 w-60 rounded-2xl bg-gray-50/50 p-4 shadow-lg backdrop-blur-md dark:bg-slate-900/50 dark:text-white dark:shadow-slate-500/20">
        <div className="mt-3 flex flex-col items-center">
          <Avatar className="size-14 border border-gray-300">
            <AvatarImage src={profileIcon} alt={name} />
            <AvatarFallback className="bg-teal-800/20 dark:bg-gray-100/20">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            Hi, {name}!
          </p>
          <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-200">
            {email}
          </p>
        </div>

        <DropdownMenuSeparator className="my-3" />

        <DropdownMenuItem className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
