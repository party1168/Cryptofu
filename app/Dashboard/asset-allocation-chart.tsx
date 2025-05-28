"use client"

import { useState } from "react"

interface AssetData {
  name: string
  value: number
  color: string
  percentage: number
}

export function AssetAllocationChart() {
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)

  const assets: AssetData[] = [
    { name: "Bitcoin", value: 52340.5, color: "#F7931A", percentage: 45.8 },
    { name: "Ethereum", value: 28456.78, color: "#627EEA", percentage: 24.9 },
    { name: "Binance Coin", value: 15678.9, color: "#F3BA2F", percentage: 13.7 },
    { name: "Cardano", value: 8234.56, color: "#0033AD", percentage: 7.2 },
    { name: "其他", value: 9569.35, color: "#8A92B2", percentage: 8.4 },
  ]

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">資產分配</h3>
        <button className="text-[#6c5ce7] text-sm font-medium">詳細分析</button>
      </div>

      <div className="flex flex-col items-center mb-6">
        {/* 圓餅圖 */}
        <div className="relative w-40 h-40 mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
            {assets.map((asset, index) => {
              const previousPercentages = assets.slice(0, index).reduce((sum, a) => sum + a.percentage, 0)
              const strokeDasharray = `${asset.percentage * 2.51} 251.2`
              const strokeDashoffset = -previousPercentages * 2.51

              return (
                <circle
                  key={asset.name}
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke={asset.color}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setSelectedAsset(asset)}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-gray-500">總資產</div>
            <div className="text-lg font-bold text-gray-700">${(totalValue / 1000).toFixed(0)}K</div>
          </div>
        </div>

        {/* 選中資產詳情 */}
        {selectedAsset && (
          <div className="bg-gray-50 rounded-lg p-3 w-full text-center mb-4">
            <div className="text-sm text-gray-600">{selectedAsset.name}</div>
            <div className="text-lg font-bold text-gray-600">${(selectedAsset.value / 1000).toFixed(1)}K</div>
            <div className="text-sm font-medium text-[#6c5ce7]">{selectedAsset.percentage}%</div>
          </div>
        )}
      </div>

      {/* 資產列表 */}
      <div className="space-y-3">
        {assets.map((asset) => (
          <div
            key={asset.name}
            className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors cursor-pointer ${
              selectedAsset?.name === asset.name ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedAsset(asset)}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
              <span className="text-sm font-medium text-gray-700">{asset.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-700">{asset.percentage}%</div>
              <div className="text-xs text-gray-500">${(asset.value / 1000).toFixed(1)}K</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
