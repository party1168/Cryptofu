import { MainClient } from "binance";
import withRetry from "../utils/withRetry";
import getBinanceSpot from "./getBinanceSpot";
import { TransactionRecords } from "@/interfaces/exchange";
const getBinanceTransaction = async (
  APIkey: string,
  APIsecret: string
): Promise<TransactionRecords[]> => {
  try {
    const client = new MainClient({ api_key: APIkey, api_secret: APIsecret });
    const spot = await getBinanceSpot(APIkey, APIsecret);
    const assets = spot.assets;
    const quoteAssets = ["USDT", "USDC", "FDUSD"];
    const transactions = await withRetry(async () => {
      const allTransactions: TransactionRecords[] = [];
      for (const asset of assets) {
        if (quoteAssets.includes(asset.symbol)) {
          continue;
        }
        for (const quoteAsset of quoteAssets) {
          const transactions = await client.getAccountTradeList({
            symbol: `${asset.symbol}${quoteAsset}`,
            limit: 1000,
          });
          if (transactions.length === 0) continue;
          const transactionRecords = transactions.map((transaction) => {
            return {
              id: transaction.id.toString(),
              orderId: transaction.orderId.toString(),
              symbol: transaction.symbol,
              price: Number(transaction.price),
              quantity: Number(transaction.qty),
              side: transaction.isBuyer ? "BUY" : "SELL",
              fee: Number(transaction.commission),
              feeCurrency: transaction.commissionAsset,
              timestamp: new Date(transaction.time).toISOString(),
              marketType: "SPOT",
            };
          });
          allTransactions.push(...transactionRecords);
        }
      }
      return allTransactions;
    });

    return transactions;
  } catch (err) {
    throw err;
  }
};

export default getBinanceTransaction;
