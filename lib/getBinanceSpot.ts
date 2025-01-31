/**
 * 從 Binance 獲取現貨資產資訊。
 *
 * @returns {Promise<Array<{ asset: string, total: string, price: string, totalprice: number }>>} 返回包含資產、總量、價格和總價的資產資訊陣列。
 * @throws 任何在請求或處理過程中發生的錯誤。
 *
 */
import {
  RestWalletTypes,
  RestSimpleEarnTypes,
  Spot,
} from "@binance/connector-typescript";
import { getCryptoPricesApi } from "./getCryptoPrice";
const BASE_URL = "https://api.binance.com";

interface AssetBalance {
  asset: string;
  total: string;
}

const convertSpotBalance = async (
  asset: RestWalletTypes.userAssetResponse[]
): Promise<AssetBalance[]> => {
  return asset.map((asset) => {
    return {
      asset: asset.asset,
      total: (Number(asset.free) + Number(asset.locked)).toString(),
    };
  });
};

const convertFundingBalance = async (
  asset: RestWalletTypes.fundingWalletResponse[]
): Promise<AssetBalance[]> => {
  return asset.map((asset) => {
    return {
      asset: asset.asset,
      total: (Number(asset.free) + Number(asset.locked)).toString(),
    };
  });
};

const convertFlexibleBalance = async (
  asset: RestSimpleEarnTypes.getFlexibleProductPositionResponse
): Promise<AssetBalance[]> => {
  return asset.rows.map((asset) => {
    return {
      asset: asset.asset,
      total: asset.totalAmount,
    };
  });
};

const convertLockedBalance = async (
  asset: RestSimpleEarnTypes.getLockedProductPositionResponse
): Promise<AssetBalance[]> => {
  return asset.rows.map((asset) => {
    return {
      asset: asset.asset,
      total: asset.amount,
    };
  });
};

export const getBinanceSpot = async (API_KEY: string, API_SECRET: string) => {
  try {
    const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });
    const options = {
      recvWindow: 5000,
    };
    const [spot, funding, flexible, locked] = await Promise.all([
      client.userAsset(options),
      client.fundingWallet(options),
      client.getFlexibleProductPosition(options),
      client.getLockedProductPosition(options),
    ]);
    const allBalances = [
      ...(await convertSpotBalance(spot)),
      ...(await convertFundingBalance(funding)),
      ...(await convertFlexibleBalance(flexible)),
      ...(await convertLockedBalance(locked)),
    ];

    const totalBalances = allBalances.reduce((acc, cur) => {
      const existing = acc.find((item) => item.asset === cur.asset);
      if (existing) {
        existing.total = (
          Number(existing.total) + Number(cur.total)
        ).toString();
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as AssetBalance[]);
    const totalAssets = await Promise.all(
      totalBalances.map(async (asset) => {
        const price = await getCryptoPricesApi(asset.asset);
        const totalprice = Number(asset.total) * Number(price);
        return {
          asset: asset.asset,
          total: asset.total,
          price: price,
          totalprice: totalprice,
        };
      })
    );
    totalAssets.sort((a, b) => b.totalprice - a.totalprice);
    return totalAssets;
  } catch (err) {
    throw err;
  }
};
