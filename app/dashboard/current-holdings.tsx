"use client"

interface Holding {
  symbol: string
  name: string
  amount: number
  value: number
  change: number
  icon: string
}

export function CurrentHoldings() {
  const holdings: Holding[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 1.2345,
      value: 52340.5,
      change: 3.45,
      icon: "₿",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 8.7654,
      value: 28456.78,
      change: -1.23,
      icon: "Ξ",
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      amount: 45.123,
      value: 15678.9,
      change: 2.67,
      icon: "B",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      amount: 2345.67,
      value: 8234.56,
      change: 5.89,
      icon: "₳",
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: 156.78,
      value: 5678.9,
      change: -2.34,
      icon: "◎",
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">目前持倉</h3>
        <button className="text-[#6c5ce7] text-sm font-medium">查看全部</button>
      </div>

      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 80px)" }}>
        {holdings.slice(0,3).map((holding) => (
          <div
            key={holding.symbol}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6c5ce7] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {holding.icon}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-700">{holding.symbol}</div>
                <div className="text-xs text-gray-300">{holding.name}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{holding.amount.toFixed(4)}</div>
              <div className="text-xs text-gray-500">${(holding.value / 1000).toFixed(1)}K</div>
            </div>

            <div
              className={`text-xs font-medium px-2 py-1 rounded ${
                holding.change >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              }`}
            >
              {holding.change >= 0 ? "+" : ""}
              {holding.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
