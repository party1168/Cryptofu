"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import Dashboard from "./dashboard/page";
import { LoginPage } from "@/components/auth/login-page";
import { RegisterPage } from "@/components/auth/register-page";

interface User {
  name: string;
  email: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  return (
    <div className="flex h-screen bg-[#eeedf5]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-3xl p-6 min-h-full">
          {/* Header */}
          <Header isLoggedIn={isLoggedIn} user={user} />

          {/* Dashboard Content */}
          {/* <Dashboard /> */}
        </div>
      </div>
    </div>
  );
}
