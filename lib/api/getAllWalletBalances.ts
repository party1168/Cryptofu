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
          return {
            wallet_label: wallet.label,
            wallet_balances: JSON.parse(cachedBalances),
          };
        }
        const walletBalances = await provider.getAccountBalance({
          walletAddress: wallet.address,
        });
        const balances = walletBalances.assets.map((asset) => {
          return {
            symbol: asset.tokenSymbol,
            amount: asset.balance,
            price: Number(Number(asset.tokenPrice).toFixed(2)),
            totalprice: Number(Number(asset.balanceUsd).toFixed(2)),
          };
        });
        const totalBalance = balances.reduce((acc, curr) => {
          return acc + curr.totalprice;
        }, 0);
        const walletData = {
          wallet_label: wallet.label,
          wallet_balances: balances,
          wallet_total_balance: totalBalance,
        };
        await redis.set(cachedKey, JSON.stringify(walletData), "EX", 60);
        return walletData;
      })
    );
    return balances;
  } catch (err) {
    throw err;
  }
};

export default getAllWalletBalances;
