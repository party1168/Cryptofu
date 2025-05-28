import { Search, Grid3X3, Bell } from "lucide-react";

export function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative p-5">
        <div className="font-bold text-2xl text-gray-800">Dashboard</div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
          <Grid3X3 className="h-5 w-5 text-gray-500" />
        </button>
        <span className="text-sm text-gray-500">Change view</span>
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button className="bg-[#f5f4fa] p-2 rounded-lg">
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
            className="text-gray-500"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
