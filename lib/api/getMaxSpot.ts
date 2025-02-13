import { MAX } from "max-exchange-api-node";
import withRetry from "./withRetry";
import { SpotBalance } from "./getBinanceSpot";

const getMaxSpot = async (APIkey: string, APIsecret: string) => {
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
  const spotwprice: SpotBalance[] = await Promise.all(
    spotp.map(async (asset) => {
      if (
        asset.currency === "twd" ||
        asset.currency === "usdt" ||
        asset.currency === "usdc"
      ) {
        return {
          symbol: asset.currency,
          amount: asset.balance.toString(),
          price: 1,
          totalprice: Number(asset.balance.toFixed(2)),
        };
      }
      const pricekey = `${asset.currency}usdt`;
      const price = indexPrice[pricekey];
      if (!price) {
        return {
          symbol: asset.currency,
          amount: asset.balance.toString(),
          price: 0,
          totalprice: 0,
        };
      }
      return {
        symbol: asset.currency,
        amount: asset.balance.toString(),
        price: Number(price.toFixed(2)),
        totalprice: Number(asset.balance.times(price).toFixed(2)),
      };
    })
  );
  const totalBalance = spotwprice.reduce((acc, cur) => acc + cur.totalprice, 0);
  return {
    label: "Max",
    assets: spotwprice,
    totalBalance,
  };
};

export default getMaxSpot;
