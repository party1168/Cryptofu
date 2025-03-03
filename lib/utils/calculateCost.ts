import { TransactionRecords } from "@/interfaces/exchange/exchange";
import { CostResult } from "@/interfaces/utils";
const quoteAsset = ["USDT", "USDC", "PYUSD", "FDUSD"];
const removeQuoteAsset = (symbol: string): string => {
  quoteAsset.forEach((quote) => {
    symbol = symbol.replace(quote, "");
  });
  return symbol;
};
const calculateCost = (transactions: TransactionRecords[]): CostResult[] => {
  const costResult: Map<string, CostResult> = new Map();
  transactions.forEach((transaction: TransactionRecords) => {
    if (quoteAsset.includes(transaction.symbol)) {
      return;
    }
    const symbol = removeQuoteAsset(transaction.symbol).toUpperCase();
    if (costResult.has(symbol)) {
      const cost = costResult.get(symbol);
      if (cost) {
        if (transaction.side === "BUY") {
          cost.totalCost += transaction.price * transaction.quantity;
          cost.totalQuantity += transaction.quantity;
        } else {
          const sellCost =
            (cost.totalCost / cost.totalQuantity) * transaction.quantity;
          cost.totalCost -= sellCost;
          cost.totalQuantity -= transaction.quantity;
        }
        cost.averageCost =
          cost.totalQuantity > 0 ? cost.totalCost / cost.totalQuantity : transaction.price;
      }
    } else {
      costResult.set(symbol, {
        symbol: symbol,
        totalCost:
          transaction.side === "BUY"
            ? transaction.price * transaction.quantity
            : -(transaction.price * transaction.quantity),
        totalQuantity:
          transaction.side === "BUY"
            ? transaction.quantity
            : -transaction.quantity,
        averageCost: transaction.price,
      });
    }
  });
  for (const [symbol, cost] of costResult) {
    if (cost.totalQuantity === 0) {
      costResult.delete(symbol);
    }
  }
  return Array.from(costResult.values());
};

export default calculateCost;
