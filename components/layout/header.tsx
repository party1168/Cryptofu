"use client";
import { Search, Bell, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const onLoginClick = () => {
    router.push("/login");
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 lg:mb-6">
      {/* Search Bar */}
      <div className="relative w-full sm:w-auto">
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
        <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-3 bg-[#f5f4fa] py-2 px-4 rounded-lg">
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
        ) : (
          <Button onClick={onLoginClick} className="bg-[#6c5ce7] hover:bg-[#5d4ed6] text-xs lg:text-sm px-3 lg:px-4">
            <LogIn className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">登入</span>
          </Button>
        )}
      </div>
    </div>
  );
}
