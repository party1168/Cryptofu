import { AnkrProvider } from "@ankr.com/ankr.js";
import redis from "@/lib/database/redis";

const ANKR_API_KEY = process.env.ANKR_API_KEY || "";

export async function getWalletBalances(address: string) {
  try {
    const cachedKey = `wallet_address:${address}`;
    const cachedBalances = await redis.get(cachedKey);
    if (cachedBalances) {
      return JSON.parse(cachedBalances);
    }

    const provider = new AnkrProvider(
      `https://rpc.ankr.com/multichain/${ANKR_API_KEY}`
    );
    const balances = await provider.getAccountBalance({
      walletAddress: address,
    });
    await redis.set(cachedKey, JSON.stringify(balances.assets), "EX", 3600);
    return balances.assets;
  } catch (err) {
    throw err;
  }
}
