import { MAX } from "max-exchange-api-node";
import { TransactionRecords } from "@/interfaces/exchange/exchange";

const getMaxTransaction = async (
  APIkey: string,
  APIsecret: string //: Promise<TransactionRecords>
) => {
  const max = new MAX({ accessKey: APIkey, secretKey: APIsecret });
  const history = await max.rest.spotWallet.getTrades({});
  const transactions: TransactionRecords[] = history.map((transaction) => {
    const getSide = (side: string) => {
      switch (side) {
        case "bid":
          return "BUY";
        case "ask":
          return "SELL";
        default:
          return side;
      }
    };
    return {
      id: transaction.id.toString(),
      orderId: transaction.orderId.toString(),
      symbol: transaction.marketName.replace("/", ""),
      price: Number(transaction.price),
      quantity: transaction.volume.toNumber(),
      side: getSide(transaction.side),
      fee: transaction.fee?.toNumber() || 0,
      feeCurrency: transaction.feeCurrency?.toString() || "",
      timestamp: transaction.createdAt.toISOString(),
      marketType: transaction.walletType,
    };
  });
  return transactions;
};

export default getMaxTransaction;
