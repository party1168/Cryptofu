import { AnkrProvider } from "@ankr.com/ankr.js";

export async function getWalletBalances(address: string) {
  try {
    const provider = new AnkrProvider("https://rpc.ankr.com/multichain/47ef14b30c164d9000fe6447586e942aefdc7a20458b93e1e0aab4cec43e9e99");
    const balances = await provider.getAccountBalance({
      walletAddress: address,
    });
    return balances.assets;
  } catch (err) {
    throw err;
  }
}
