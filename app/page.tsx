"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import Dashboard from "./Dashboard/page";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="flex h-screen bg-[#eeedf5]">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-3xl p-6 min-h-full">
          {/* Header */}
          <Header />

          {/* Dashboard Content */}
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
