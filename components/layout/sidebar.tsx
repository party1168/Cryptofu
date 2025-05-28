"use client";
import { X } from "lucide-react";
import { NavItem } from "@/components/layout/nav-item";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navItems = [
  {
    id: "dashboard",
    label: "總覽",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "assets",
    label: "資產明細",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M18 12V8" />
        <path d="M12 18v-9" />
        <path d="M7 15v-3" />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "交易明細",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "帳戶與設定",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];
export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname().replace("/", "") || "overview";
  const router = useRouter();
  return (
    <div className="w-64 sm:w-72 lg:w-64 bg-white p-4 lg:p-6 flex flex-col h-full">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
      {/* Mobile Title */}
      <div className="flex items-center gap-3 mb-8 lg:mb-10">
        <div className="bg-[#6c5ce7] w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm lg:text-base">C</span>
        </div>
        <span className="text-sm lg:text-base font-medium">Cryptofu</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.id}
              onClick={() => router.push(`/${item.id}`)}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
