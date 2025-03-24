import { MAX } from "max-exchange-api-node";
import withRetry from "../utils/withRetry";
import { IUnifiedAsset, IAssetStorage } from "@/interfaces/utils";

const getMaxSpot = async (
  APIkey: string,
  APIsecret: string
): Promise<IAssetStorage> => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const spot = await withRetry(
    async () => await max.rest.spotWallet.getAccounts({})
  );
  const spotp = spot
    .filter((asset) => !asset.balance.equals(0) || !asset.locked.equals(0))
    .map((asset) => asset);
  const indexPrice = await withRetry(
    async () => await max.rest.getIndexPrices()
  );
  const spotwprice: IUnifiedAsset[] = await Promise.all(
    spotp.map(async (asset) => {
      if (asset.currency === "twd") {
        return {
          symbol: asset.currency.toUpperCase(),
          amount: asset.balance.toNumber(),
          price: 0.3,
          totalValue: Number(asset.balance.times(0.3).toFixed(3)),
        };
      }
      if (asset.currency === "usdt" || asset.currency === "usdc") {
        return {
          symbol: asset.currency.toUpperCase(),
          amount: asset.balance.toNumber(),
          price: 1,
          totalValue: Number(asset.balance.toFixed(3)),
        };
      }
      const pricekey = `${asset.currency}usdt`;
      const price = indexPrice[pricekey];
      if (!price) {
        return {
          symbol: asset.currency,
          amount: asset.balance.toNumber(),
          price: 0,
          totalValue: 0,
        };
      }
      return {
        symbol: asset.currency.toUpperCase(),
        amount: asset.balance.toNumber(),
        price: Number(price.toFixed(3)),
        totalValue: Number(asset.balance.times(price).toFixed(3)),
      };
    })
  );
  const totalBalance = spotwprice.reduce((acc, cur) => acc + cur.totalValue, 0);
  return {
    label: "Max",
    assets: spotwprice,
    totalBalance,
  };
};

export default getMaxSpot;
