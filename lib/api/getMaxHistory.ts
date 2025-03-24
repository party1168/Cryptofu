import { MAX } from "max-exchange-api-node";
import withRetry from "../utils/withRetry";
import { IDepositAmount } from "@/interfaces/utils";
import getMaxTransaction from "./getMaxTransaction";

const getMaxHistory = async (APIkey: string, APIsecret: string) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const transaction = await withRetry(async () => max.rest.getDeposits({}));
  return transaction;
};

export const getMaxTWDDeposit = async (
  APIkey: string,
  APIsecret: string
): Promise<IDepositAmount> => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const deposit = await withRetry(
    async () => await max.rest.getDeposits({ currency: "twd" })
  );
  const depositTWD = deposit.reduce(
    (acc, cur) => acc + cur.amount.toNumber(),
    0
  );

  const USDTransaction = (await getMaxTransaction(APIkey, APIsecret)).filter(
    (transaction) =>
      transaction.symbol === "USDTTWD" || transaction.symbol === "USDCTWD"
  );
  const depositUSD = USDTransaction.reduce((acc, cur) => acc + cur.quantity, 0);
  const value = {
    depositTWD,
    depositUSD,
  };
  return value;
};

export default getMaxHistory;
