import { MainClient } from "binance";
import withRetry from "./withRetry";
import getBinanceSpot from "./getBinanceSpot";

const getBinanceTransaction = async (APIkey: string, APIsecret: string) => {
  try {
    const client = new MainClient({ api_key: APIkey, api_secret: APIsecret });
    const spot = await getBinanceSpot(APIkey, APIsecret);
    const assets = spot.assets;
    const quoteAssets = ["USDT", "USDC", "FDUSD"];
    const transactions = await withRetry(async () => {
      const allTransactions = [];
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
          allTransactions.push(...transactions);
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
