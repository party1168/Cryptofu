import { getMaxTWDDeposit } from "./getMaxHistory";
import connectDB from "@/lib/database/db";
import Exchange from "@/models/Exchange";
import { IExchange } from "@/interfaces/models";
import { decryptAES } from "../utils/rijindael";
import { IDepositAmount } from "@/interfaces/utils";

const supportedTWDExchanges = ["Max"];

const getAllDeposit = async (uuid: string): Promise<IDepositAmount> => {
  try {
    await connectDB();
    const exchanges: IExchange[] = await Exchange.find({
      userId: uuid,
      name: { $in: supportedTWDExchanges },
    });
    const deposits: IDepositAmount = {
      depositTWD: 0,
      depositUSD: 0,
    };

    for (const exchange of exchanges) {
      let exchangeDeposit: IDepositAmount;
      switch (exchange.name) {
        case "Max":
          exchangeDeposit = await getMaxTWDDeposit(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret)
          );
          break;
        default:
          exchangeDeposit = { depositTWD: 0, depositUSD: 0 };
      }
      if (exchangeDeposit) {
        deposits.depositTWD += exchangeDeposit.depositTWD;
        deposits.depositUSD += exchangeDeposit.depositUSD;
      }
    }
    return deposits;
  } catch (err) {
    throw err;
  }
};

export default getAllDeposit;
