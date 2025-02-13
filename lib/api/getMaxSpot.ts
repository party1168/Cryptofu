import { MAX } from "max-exchange-api-node";

const getMaxSpot = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const spot = await max.rest.spotWallet.getAccounts({});
  const spotp = spot
    .filter((asset) => !asset.balance.equals(0) || !asset.locked.equals(0))
    .map((asset) => asset);
  return spotp;
};

export default getMaxSpot;
