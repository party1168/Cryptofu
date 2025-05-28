"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useState } from "react";
interface User {
  name: string;
  email: string;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = ["/login", "/register"].includes(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  if (hideLayout) {
    return children;
  }

  return (
    <div className="flex h-screen bg-[#eeedf5]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-3xl p-6 min-h-full">
          <Header isLoggedIn={isLoggedIn} user={user} />
          {children}
        </div>
      </div>
    </div>
  );
}
