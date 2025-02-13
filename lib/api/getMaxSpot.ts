import { MAX } from "max-exchange-api-node";

const getMaxSpot = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const spot = await max.rest.spotWallet.getAccounts({});
  const spotp = spot
    .filter((asset) => !asset.balance.equals(0) || !asset.locked.equals(0))
    .map((asset) => asset);
  const indexPrice = await max.rest.getIndexPrices();
  const spotwprice = await Promise.all(
    spotp.map(async (asset) => {
      if (asset.currency === "twd" || asset.currency === "usdt" || asset.currency === "usdc") {
        return {
          symbol: asset.currency,
          amoumt: asset.balance,
          price: 1,
          totalprice: Number(asset.balance.toFixed(2)),
        };
      }
      const pricekey = `${asset.currency}usdt`;
      const price = indexPrice[pricekey];
      if (!price) {
        return {
          symbol: asset.currency,
          amoumt: asset.balance,
          price: 0,
          totalprice: 0,
        };
      }
      return {
        symbol: asset.currency,
        amoumt: asset.balance,
        price: Number(price.toFixed(2)),
        totalprice: Number(asset.balance.times(price).toFixed(2)),
      };
    })
  );
  const totalBalance = spotwprice.reduce((acc, cur) => acc + cur.totalprice, 0);
  return {
    exchange:"Max",
    assets: spotwprice,
    totalBalance
  };
};

export default getMaxSpot;
