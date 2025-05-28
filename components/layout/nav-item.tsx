"use client"

import type React from "react"

interface NavItemProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
}

export function NavItem({ id, label, icon, isActive, onClick }: NavItemProps) {
  return (
    <li id={id}>
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-2 rounded-lg ${
          isActive ? "text-[#6c5ce7] bg-[#f5f4fa]" : "text-gray-500"
        }`}
      >
        {icon}
        {label}
      </button>
    </li>
  )
}
