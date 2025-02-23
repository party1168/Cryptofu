import { RestClient } from "okx-api";
import { TransactionRecords } from "@/interfaces/exchange";
import { OkxBillArchiveType } from "@/interfaces/exchange";

const quoteAssets = ["USDT", "USDC", "FDUSD", "PYUSD"];
const getOkxTransaction = async (
  APIkey: string,
  APIsecret: string,
  passphrase: string
) => {
  try {
    const client = new RestClient({
      apiKey: APIkey,
      apiSecret: APIsecret,
      apiPass: passphrase,
    });
    const transaction = (
      await client.getBillsArchive({
        instType: "SPOT",
      })
    ).filter((transaction) => {
      const parts = transaction.instId.split("-");
      if (!quoteAssets.includes(parts[1])) {
        return;
      }
      return transaction;
    }) as OkxBillArchiveType[];

    const transactionRecords: TransactionRecords[] = transaction.map(
      (transaction) => {
        const getSide = (subType: string) => {
          switch (subType) {
            case "1":
            case "236":
            case "318":
              return "BUY";
            case "2":
            case "237":
            case "319":
              return "SELL";
            default:
              return subType;
          }
        };
        return {
          id: transaction.billId,
          orderId: transaction.ordId,
          symbol: transaction.instId.replace("-", ""),
          price: Number(transaction.px),
          quantity: Number(transaction.sz),
          side: getSide(transaction.subType),
          fee: Number(transaction.fee),
          feeCurrency: transaction.ccy,
          timestamp: new Date(parseInt(transaction.fillTime)).toISOString(),
          marketType: transaction.instType,
        };
      }
    );
    return transactionRecords;
  } catch (err) {
    throw err;
  }
};

export default getOkxTransaction;
