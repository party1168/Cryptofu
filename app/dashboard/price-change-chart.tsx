"use client"

import { useState } from "react"

export function PriceChangeChart() {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1D")

  const timeframes = [
    { key: "1D" as const, label: "1天" },
    { key: "1W" as const, label: "1週" },
    { key: "1M" as const, label: "1月" },
    { key: "1Y" as const, label: "1年" },
  ]

  const chartData = {
    "1D": {
      change: 2.34,
      points:
        "M0,60 C20,45 40,70 60,40 C80,25 100,55 120,35 C140,20 160,45 180,30 C200,15 220,40 240,25 C260,10 280,35 300,20",
    },
    "1W": {
      change: 8.67,
      points: "M0,50 C30,30 60,65 90,35 C120,20 150,50 180,25 C210,10 240,45 270,30 C300,15",
    },
    "1M": {
      change: -3.45,
      points: "M0,30 C30,50 60,25 90,55 C120,70 150,40 180,65 C210,80 240,55 270,70 C300,85",
    },
    "1Y": {
      change: 156.78,
      points: "M0,80 C30,70 60,60 90,45 C120,35 150,25 180,15 C210,10 240,5 270,3 C300,2",
    },
  }

  const currentData = chartData[timeframe]
  const isPositive = currentData.change >= 0

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">漲跌曲線</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                timeframe === tf.key ? "bg-[#6c5ce7] text-white" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : ""}
          {currentData.change}%
        </div>
        <div className="text-sm text-gray-500">過去 {timeframes.find((tf) => tf.key === timeframe)?.label}</div>
      </div>

      <div className="h-40 relative">
        <svg viewBox="0 0 300 100" className="w-full h-full">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${currentData.points} L300,100 L0,100 Z`} fill="url(#chartGradient)" />
          <path d={currentData.points} fill="none" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth="3" />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
          {timeframe === "1D" && (
            <>
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </>
          )}
          {timeframe === "1W" && (
            <>
              <span>週一</span>
              <span>週三</span>
              <span>週五</span>
              <span>週日</span>
            </>
          )}
          {timeframe === "1M" && (
            <>
              <span>第1週</span>
              <span>第2週</span>
              <span>第3週</span>
              <span>第4週</span>
            </>
          )}
          {timeframe === "1Y" && (
            <>
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
