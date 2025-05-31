"use client";
import { Bell, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
}

export function Header({ isLoggedIn, user }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 lg:mb-6">
      {/* Search Bar */}
      <div className="relative w-full sm:w-auto"></div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
          <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />
        </button>

        {isLoggedIn ? (
          <DropdownMenu >
            <DropdownMenuTrigger className=" bg-[#f5f4fa] py-2 px-4 rounded-lg cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" bg-[#f5f4fa] text-gray-700 w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" >
                  個人資料
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/logout" >
                  登出
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button className="bg-[#6c5ce7] hover:bg-[#5d4ed6] text-xs lg:text-sm px-3 lg:px-4">
              <LogIn className="text-white mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline text-white">登入</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
