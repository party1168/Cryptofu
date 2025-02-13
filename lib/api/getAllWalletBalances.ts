import { AnkrProvider } from "@ankr.com/ankr.js";
import redis from "@/lib/database/redis";
import { WalletParams } from "./addWallet";

const ANKR_API_KEY = process.env.ANKR_API_KEY || "";

const getAllWalletBalances = async (wallets: WalletParams[]) => {
  try {
    const provider = new AnkrProvider(
      `https://rpc.ankr.com/multichain/${ANKR_API_KEY}`
    );
    const balances = await Promise.all(
      wallets.map(async (wallet: WalletParams) => {
        const cachedKey = `wallet_address:${wallet.address}`;
        const cachedBalances = await redis.get(cachedKey);
        if (cachedBalances) {
          return JSON.parse(cachedBalances);
        }
        const walletBalances = await provider.getAccountBalance({
          walletAddress: wallet.address,
        });
        await redis.set(
          cachedKey,
          JSON.stringify(walletBalances.assets),
          "EX",
          3600
        );
        return {
          wallet_label: wallet.label,
          wallet_balances: walletBalances.assets,
        };
      })
    );
    return balances;
  } catch (err) {
    throw err;
  }
};

export default getAllWalletBalances;
