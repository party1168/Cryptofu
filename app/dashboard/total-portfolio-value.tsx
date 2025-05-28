"use client"

import { useState } from "react"

export function TotalPortfolioValue() {
  const [currency, setCurrency] = useState<"USD" | "TWD">("USD")

  const portfolioData = {
    USD: {
      total: 45678.9,
      change: 2.34,
      changeAmount: 1045.67,
    },
    TWD: {
      total: 1456789.5,
      change: 2.34,
      changeAmount: 33456.78,
    },
  }

  const currentData = portfolioData[currency]
  const isPositive = currentData.change >= 0

  return (
    <div className="bg-gradient-to-br from-[#6c5ce7] to-[#5d4ed6] rounded-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold opacity-90">資產總值</h3>
        <div className="flex bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              currency === "USD" ? "bg-white text-[#6c5ce7]" : "text-white/80"
            }`}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency("TWD")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              currency === "TWD" ? "bg-white text-[#6c5ce7]" : "text-white/80"
            }`}
          >
            TWD
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold mb-2">
          {currency === "USD" ? "$" : "NT$"}
          {currentData.total.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              isPositive ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
            }`}
          >
            {isPositive ? "+" : ""}
            {currentData.change}%
          </span>
          <span className="text-sm opacity-80">
            {isPositive ? "+" : ""}
            {currency === "USD" ? "$" : "NT$"}
            {currentData.changeAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-16 relative">
        <svg viewBox="0 0 300 60" className="w-full h-full">
          <path
            d="M0,40 C30,35 60,45 90,30 C120,15 150,25 180,20 C210,15 240,30 270,25 C300,20"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
          />
          <path
            d="M0,40 C30,35 60,45 90,30 C120,15 150,25 180,20 C210,15 240,30 270,25 C300,20"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
    </div>
  )
}
