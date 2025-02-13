import { ExchangeParams } from "./addExchange";
import getBinanceSpot, { SpotBalance } from "./getBinanceSpot";
import getOkxSpot from "./getOkxSpot";
import getMaxSpot from "./getMaxSpot";
import { decryptAES } from "@/lib/utils/rijindael";
interface exchangeResponse {
  exchange: string;
  assets: SpotBalance[];
  totalBalance: number;
}
const getAllSpot = async (exchanges: ExchangeParams[]) => {
  const spotData = await Promise.all(
    exchanges.map(async (exchange: ExchangeParams) => {
      let spot: exchangeResponse;
      console.log(exchange.name);
      switch (exchange.name) {
        case "OKX":
          if (!exchange.passphrase) {
            throw new Error("Passphrase is required for OKX");
          }
          spot = await getOkxSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret),
            decryptAES(exchange.passphrase)
          );
          break;
        case "Binance":
          spot = await getBinanceSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret)
          );
          break;
        case "Max":
          spot = await getMaxSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret)
          );
          break;
        default:
          spot = {
            exchange: exchange.name,
            assets: [],
            totalBalance: 0,
          };
          break;
      }
      if (!spot) {
        throw new Error("Failed to fetch balances");
      }
      return spot;
    })
  );
  if (!spotData) {
    throw new Error("Failed to fetch balances");
  }
  const spotwTotal = spotData
    .reduce((sum, spot) => {
      return sum + spot.totalBalance;
    }, 0)
    .toFixed(2);
  const data = {
    spotData,
    totalBalance: Number(spotwTotal),
  };
  return data;
};

export default getAllSpot;
