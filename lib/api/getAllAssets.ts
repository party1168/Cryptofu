import connectDB from "../database/db";
import getAllSpot from "./getAllSpot";
import getAllWalletBalances from "./getAllWalletBalances";
import Exchange from "@/models/Exchange";
import Wallet from "@/models/Wallet";
import {
  IUnifiedAsset,
  IPortfolioAsset,
  IUserPortfolioSummary,
} from "@/interfaces/utils";
import getExchangeTransaction from "./getExchangeTransaction";
import calculateCost from "../utils/calculateCost";
import calculateROI from "../utils/calculateROI";

const getAllAssets = async (uuid: string) => {
  try {
    await connectDB();
    const wallets = await Wallet.find({ userId: uuid });
    const exchanges = await Exchange.find({ userId: uuid });
    const walletBalances = await getAllWalletBalances(wallets);
    const exchangeBalances = await getAllSpot(exchanges);
    const combinedAssets = new Map<string, IUnifiedAsset>();

    walletBalances.forEach((wallet) => {
      wallet.assets.forEach((asset) => {
        const symbol = asset.symbol;
        if (!combinedAssets.has(symbol)) {
          combinedAssets.set(symbol, {
            symbol,
            amount: 0,
            price: asset.price,
            totalValue: 0,
          });
        }

        const combined = combinedAssets.get(symbol);
        if (combined) {
          const amount = Number(asset.amount);
          combined.amount += amount;
          combined.totalValue += amount * asset.price;
        }
      });
    });

    exchangeBalances.forEach((exchange) => {
      exchange.assets.forEach((asset) => {
        const symbol = asset.symbol;
        if (!combinedAssets.has(symbol)) {
          combinedAssets.set(symbol, {
            symbol,
            amount: 0,
            price: asset.price,
            totalValue: 0,
          });
        }

        const combined = combinedAssets.get(symbol);
        if (combined) {
          const amount = Number(asset.amount);
          combined.amount += amount;
          combined.totalValue += amount * asset.price;
        }
      });
    });

    const assets = Array.from(combinedAssets.values())
      .filter((asset) => asset.amount > 0)
      .sort((a, b) => b.totalValue - a.totalValue);
    const exchangeTransactions = await getExchangeTransaction(uuid);
    const costResult = calculateCost(exchangeTransactions);
    const assetswithROI: IPortfolioAsset[] = assets
      .map((asset) => {
        const cost = costResult.find((cost) => cost.symbol === asset.symbol);
        const averageCost = cost ? cost.averageCost : 0;
        return {
          symbol: asset.symbol,
          totalAmount: asset.amount,
          averageCost,
          price: asset.price,
          totalValue: asset.totalValue,
          roi: calculateROI(averageCost, asset.price),
        };
      })
      .filter((asset) => asset.totalValue > 0.01);
    const result = {
      assets: assetswithROI,
      totalValue: assets.reduce((sum, asset) => sum + asset.totalValue, 0),
    };
    return result;
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
