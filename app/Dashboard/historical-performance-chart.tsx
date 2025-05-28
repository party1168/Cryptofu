"use client"

import { useState } from "react"

interface MonthlyData {
  month: string
  profit: number
  loss: number
}

export function HistoricalPerformanceChart() {
  const [timeframe, setTimeframe] = useState<"3M" | "6M" | "1Y">("6M")

  const timeframes = [
    { key: "3M" as const, label: "3個月" },
    { key: "6M" as const, label: "6個月" },
    { key: "1Y" as const, label: "1年" },
  ]

  const monthlyData: Record<string, MonthlyData[]> = {
    "3M": [
      { month: "3月", profit: 4500, loss: 0 },
      { month: "4月", profit: 0, loss: 2300 },
      { month: "5月", profit: 6700, loss: 0 },
    ],
    "6M": [
      { month: "12月", profit: 3200, loss: 0 },
      { month: "1月", profit: 0, loss: 1800 },
      { month: "2月", profit: 2500, loss: 0 },
      { month: "3月", profit: 4500, loss: 0 },
      { month: "4月", profit: 0, loss: 2300 },
      { month: "5月", profit: 6700, loss: 0 },
    ],
    "1Y": [
      { month: "6月", profit: 0, loss: 1200 },
      { month: "7月", profit: 2800, loss: 0 },
      { month: "8月", profit: 3500, loss: 0 },
      { month: "9月", profit: 0, loss: 2700 },
      { month: "10月", profit: 0, loss: 3400 },
      { month: "11月", profit: 5200, loss: 0 },
    ],
  }

  const currentData = monthlyData[timeframe]
  const maxValue = Math.max(...currentData.map((item) => Math.max(item.profit, item.loss)))
  const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0)
  const totalLoss = currentData.reduce((sum, item) => sum + item.loss, 0)
  const netResult = totalProfit - totalLoss

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">歷史表現</h3>
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">淨收益</div>
          <div className={`text-2xl font-bold ${netResult >= 0 ? "text-green-600" : "text-red-600"}`}>
            {netResult >= 0 ? "+" : ""}${(netResult / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">收益</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">虧損</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2" style={{ height: "200px" }}>
        {currentData.map((item, index) => {
          const profitHeight = item.profit > 0 ? (item.profit / maxValue) * 160 : 0
          const lossHeight = item.loss > 0 ? (item.loss / maxValue) * 160 : 0

          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: "160px" }}>
                {/* 收益柱 */}
                {item.profit > 0 && (
                  <div
                    className="w-6 bg-green-500 rounded-t-sm transition-all group-hover:bg-green-600"
                    style={{ height: `${profitHeight}px` }}
                    title={`收益: $${item.profit.toLocaleString()}`}
                  ></div>
                )}

                {/* 虧損柱 */}
                {item.loss > 0 && (
                  <div
                    className="w-6 bg-red-500 rounded-t-sm transition-all group-hover:bg-red-600"
                    style={{ height: `${lossHeight}px` }}
                    title={`虧損: $${item.loss.toLocaleString()}`}
                  ></div>
                )}

                {/* 當沒有數據時顯示空柱 */}
                {item.profit === 0 && item.loss === 0 && <div className="w-6 h-2 bg-gray-200 rounded-sm"></div>}
              </div>

              {/* 月份標籤 */}
              <div className="text-xs text-gray-500 mt-2">{item.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
