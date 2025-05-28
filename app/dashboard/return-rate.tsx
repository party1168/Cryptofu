"use client"

export function ReturnRate() {
  // 模擬總投資組合數據
  const totalPortfolioReturn = {
    totalCost: 156789.45,
    totalValue: 189234.67,
    totalProfit: 32445.22,
  }

  const overallReturnRate =
    ((totalPortfolioReturn.totalValue - totalPortfolioReturn.totalCost) / totalPortfolioReturn.totalCost) * 100

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">收益率分析</h3>
        <button className="text-[#6c5ce7] text-sm font-medium">詳細報告</button>
      </div>

      {/* Overall Portfolio Performance */}
      <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-2">總投資組合收益</div>
          <div className={`text-3xl font-bold mb-2 ${overallReturnRate >= 0 ? "text-green-600" : "text-red-600"}`}>
            {overallReturnRate >= 0 ? "+" : ""}
            {overallReturnRate.toFixed(2)}%
          </div>
          <div
            className={`text-xl font-semibold ${totalPortfolioReturn.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalPortfolioReturn.totalProfit >= 0 ? "+" : ""}${totalPortfolioReturn.totalProfit.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">投入成本</div>
            <div className="text-lg font-medium text-gray-600">${totalPortfolioReturn.totalCost.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">目前價值</div>
            <div className="text-lg font-medium text-gray-600">${totalPortfolioReturn.totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
