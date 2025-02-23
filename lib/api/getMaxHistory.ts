import { MAX } from "max-exchange-api-node";

const getMaxHistory = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const transaction = await max.rest.getDeposits({});
  return transaction;
};

export default getMaxHistory;