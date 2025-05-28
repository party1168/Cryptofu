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
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 bg-[#f5f4fa] rounded-lg text-sm w-64"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-3 bg-[#f5f4fa] py-2 px-4 rounded-lg">
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            className="bg-[#6c5ce7] hover:bg-[#5d4ed6] text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            登入
          </Button>
        )}
      </div>
    </div>
  );
}
