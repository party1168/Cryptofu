import { MAX } from "max-exchange-api-node";
import withRetry from "../utils/withRetry";

const getMaxHistory = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const transaction = await withRetry(async () => max.rest.getDeposits({}));
  return transaction;
};
export const getMaxTWDDeposit = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const deposit = await withRetry(
    async () => await max.rest.getDeposits({ currency: "twd" })
  );
  return deposit;
};

export default getMaxHistory;
