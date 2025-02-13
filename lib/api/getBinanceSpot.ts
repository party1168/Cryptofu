/**
 * 從 Binance 獲取現貨資產資訊。
 *
 * @returns {Promise<Array<{ asset: string, amount: string, price: string, totalprice: number }>>} 返回包含資產、總量、價格和總價的資產資訊陣列。
 * @throws 任何在請求或處理過程中發生的錯誤。
 *
 */
import {
  RestWalletTypes,
  RestSimpleEarnTypes,
  Spot,
} from "@binance/connector-typescript";
import { getCryptoPricesApi } from "./getCryptoPrice";
import withRetry from "./withRetry";
const BASE_URL = "https://api.binance.com";

export interface SpotBalance {
  symbol: string;
  amount: string;
  price: number;
  totalprice: number;
}

interface AssetBalance {
  asset: string;
  amount: string;
}

const convertSpotBalance = async (
  asset: RestWalletTypes.userAssetResponse[]
): Promise<AssetBalance[]> => {
  return asset.map((asset) => {
    return {
      asset: asset.asset,
      amount: (Number(asset.free) + Number(asset.locked)).toString(),
    };
  });
};

const convertFundingBalance = async (
  asset: RestWalletTypes.fundingWalletResponse[]
): Promise<AssetBalance[]> => {
  return asset.map((asset) => {
    return {
      asset: asset.asset,
      amount: (Number(asset.free) + Number(asset.locked)).toString(),
    };
  });
};

const convertFlexibleBalance = async (
  asset: RestSimpleEarnTypes.getFlexibleProductPositionResponse
): Promise<AssetBalance[]> => {
  return asset.rows.map((asset) => {
    return {
      asset: asset.asset,
      amount: asset.totalAmount,
    };
  });
};

const convertLockedBalance = async (
  asset: RestSimpleEarnTypes.getLockedProductPositionResponse
): Promise<AssetBalance[]> => {
  return asset.rows.map((asset) => {
    return {
      asset: asset.asset,
      amount: asset.amount,
    };
  });
};

const getBinanceSpot = async (API_KEY: string, API_SECRET: string) => {
  try {
    const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });
    const serverTime = await client.checkServerTime();
    const options = {
      recvWindow: 5000,
      timestamp: serverTime.serverTime,
    };
    const result = await withRetry(() => {
      return Promise.all([
        client.userAsset(options),
        client.fundingWallet(options),
        client.getFlexibleProductPosition(options),
        client.getLockedProductPosition(options),
      ]);
    });
    if (!result) {
      throw new Error("Failed to fetch balances.");
    }
    const [spot, funding, flexible, locked] = result;
    const allBalances = [
      ...(await convertSpotBalance(spot)),
      ...(await convertFundingBalance(funding)),
      ...(await convertFlexibleBalance(flexible)),
      ...(await convertLockedBalance(locked)),
    ];

    const totalBalances = allBalances.reduce((acc, cur) => {
      const existing = acc.find((item) => item.asset === cur.asset);
      if (existing) {
        existing.amount = (
          Number(existing.amount) + Number(cur.amount)
        ).toString();
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as AssetBalance[]);
    let totalBalance = 0;
    const totalAssets = await Promise.all<SpotBalance>(
      totalBalances.map(async (asset) => {
        const price = await getCryptoPricesApi(asset.asset);
        const totalprice = Number(asset.amount) * Number(price);
        totalBalance += totalprice;
        return {
          symbol: asset.asset,
          amount: asset.amount,
          price: price,
          totalprice: Number(totalprice.toFixed(2)),
        };
      })
    );
    totalAssets.sort((a, b) => b.totalprice - a.totalprice);
    totalBalance = Number(totalBalance.toFixed(2));
    return {
      exchange: "Binance",
      assets: totalAssets,
      totalBalance
    };
  } catch (err) {
    throw err;
  }
};

export default getBinanceSpot;