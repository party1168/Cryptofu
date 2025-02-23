import connectDB from "../database/db";
import getAllSpot from "./getAllSpot";
import getAllWalletBalances from "./getAllWalletBalances";
import Exchange from "@/models/Exchange";
import Wallet from "@/models/Wallet";

const getAllAssets = async (uuid: string) => {
  try {
    await connectDB();
    const wallets = await Wallet.find({ userId: uuid });
    const exchanges = await Exchange.find({ userId: uuid });
    const walletBalances = await getAllWalletBalances(wallets);
    const exchangeBalances = await getAllSpot(exchanges);
    const walletValue = Number(
      walletBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const exchangeValue = Number(
      exchangeBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const portfolioBalance = walletValue + exchangeValue;
    const portfolio = {
      walletBalances,
      exchangeBalances,
      portfolioBalance,
    };
    return portfolio;
  } catch (err) {
    throw err;
  }
};

export const getAllAssetsDetail = async (uuid: string) => {
  try {
    await connectDB();
    const wallets = await Wallet.find({ userId: uuid });
    const exchanges = await Exchange.find({ userId: uuid });
    const walletBalances = await getAllWalletBalances(wallets);
    const exchangeBalances = await getAllSpot(exchanges);
    const walletValue = Number(
      walletBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const exchangeValue = Number(
      exchangeBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const portfolioBalance = walletValue + exchangeValue;
    const portfolio = {
      walletBalances,
      exchangeBalances,
      portfolioBalance,
    };
    return portfolio;
  } catch (err) {
    throw err;
  }
};

export default getAllAssets;
