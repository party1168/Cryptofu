import { AnkrProvider } from "@ankr.com/ankr.js";
import redis from "@/lib/database/redis";
import { IBalance } from "@/interfaces/utils";
import { WalletParams, WalletBalance } from "@/interfaces/wallet/wallet";

const ANKR_API_KEY = process.env.ANKR_API_KEY || "";

const getAllWalletBalances = async (
  wallets: WalletParams[]
): Promise<IBalance[]> => {
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
        const balances: WalletBalance[] = walletBalances.assets.map((asset) => {
          return {
            symbol: asset.tokenSymbol,
            network: asset.blockchain.toString(),
            amount: asset.balance,
            price: Number(Number(asset.tokenPrice).toFixed(3)),
            totalprice: Number(Number(asset.balanceUsd).toFixed(3)),
          };
        });
        const totalBalance = balances.reduce((acc, curr) => {
          return acc + curr.totalprice;
        }, 0);
        const walletData = {
          label: wallet.label,
          assets: balances,
          totalBalance: Number(totalBalance.toFixed(3)),
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
