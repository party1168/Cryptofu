import { MAX } from "max-exchange-api-node";

const getMaxHistory = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const history = await max.rest.spotWallet.getTrades({});
  return history;
};

export default getMaxHistory;