import { RawAccountTrade } from "binance";
import { CostResult } from "@/interfaces/utils";
const quoteAssets = ["USDT", "USDC", "FDUSD", "PYUSD"];

const calculateCosts = (transactions: RawAccountTrade[]) => {
  const costsMap: { [key: string]: CostResult } = {};

  transactions.forEach((transaction: RawAccountTrade) => {
    const { symbol, quoteQty, qty, isBuyer } = transaction;
    const quantity = parseFloat(qty.toString());
    const cost = parseFloat(quoteQty.toString());
    const baseAsset = symbol.replace(
      quoteAssets.find((quote) => symbol.endsWith(quote)) || "",
      ""
    );
    if (!costsMap[baseAsset]) {
      costsMap[baseAsset] = {
        symbol: baseAsset,
        totalCost: 0,
        totalQuantity: 0,
        averageCost: 0,
      };
    }
    if (isBuyer) {
      costsMap[baseAsset].totalCost += cost;
      costsMap[baseAsset].totalQuantity += quantity;
    } else {
      costsMap[baseAsset].totalCost -= cost;
      costsMap[baseAsset].totalQuantity -= quantity;
    }

    if (costsMap[baseAsset].totalQuantity !== 0) {
      costsMap[baseAsset].averageCost =
        costsMap[baseAsset].totalCost / costsMap[baseAsset].totalQuantity;
    } else {
      costsMap[baseAsset].averageCost = 0;
    }
  });
  return Object.values(costsMap);
};

export default calculateCosts;
