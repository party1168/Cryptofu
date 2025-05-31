"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { V_IUser } from "@/interfaces/models";
import axios from "axios";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = ["/login", "/register"].includes(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<V_IUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const checkLoginStatus = async () => {
    try {
      const res = await axios.get("/api/auth/login");
      console.log("Login status response:", res.data);
      // 200 狀態走這裡
      setIsLoggedIn(true);
      setUser(res.data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // token 沒有或失效，這裡靜默處理
          setIsLoggedIn(false);
          setUser(null);
        } else {
          console.error("Unexpected response status:", error.response?.status);
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    // Check login status when the component mounts
    checkLoginStatus();
  }, []);
  if (hideLayout) {
    return children;
  }

  return (
    <div className="flex h-screen bg-[#eeedf5] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-[#f5f4fa]"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            {/* Mobile Header Title */}
            <div className="flex items-center">
              <span className="text-xl lg:text-2xl font-bold text-gray-700">
                Cryptofu
              </span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 min-h-full">
            <Header isLoggedIn={isLoggedIn} user={user} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
