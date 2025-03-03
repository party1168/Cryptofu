import getBinanceTransaction from "./getBinanceTransaction";
import { decryptAES } from "../utils/rijindael";
import getOkxTransaction from "./getOkxTransaction";
import getMaxTransaction from "./getMaxTransaction";
import connectDB from "../database/db";
import { TransactionRecords } from "@/interfaces/exchange/exchange";
import Exchange from "@/models/Exchange";

const getExchangeTransaction = async (
  uuid: string
): Promise<TransactionRecords[]> => {
  try {
    await connectDB();
    const exchanges = await Exchange.find({ userId: uuid });
    const transactions = await Promise.all(
      exchanges.map(async (exchange) => {
        let transaction: TransactionRecords[] = [];
        switch (exchange.name) {
          case "Binance":
            transaction = await getBinanceTransaction(
              decryptAES(exchange.APIkey),
              decryptAES(exchange.APIsecret)
            );
            break;
          case "OKX":
            transaction = await getOkxTransaction(
              decryptAES(exchange.APIkey),
              decryptAES(exchange.APIsecret),
              decryptAES(exchange.passphrase)
            );
            break;
          case "Max":
            transaction = await getMaxTransaction(
              decryptAES(exchange.APIkey),
              decryptAES(exchange.APIsecret)
            );
            break;
          default:
            break;
        }
        return transaction;
      })
    );
    return transactions.flat();
  } catch (err) {
    throw err;
  }
};

export default getExchangeTransaction;
