import { IExchange } from "@/interfaces/models";
import { IAssetStorage, IUnifiedAsset } from "@/interfaces/utils";
import getBinanceSpot from "./getBinanceSpot";
import getOkxSpot from "./getOkxSpot";
import getMaxSpot from "./getMaxSpot";
import { decryptAES } from "@/lib/utils/rijindael";
import redis from "../database/redis";

const getAllSpot = async (exchanges: IExchange[]): Promise<IAssetStorage[]> => {
  const spotData = await Promise.all(
    exchanges.map(async (exchange: IExchange) => {
      let spot: IAssetStorage;
      const cachedKey = `spot:${exchange.userId}:${exchange.name}`;
      const existingSpotData = await redis.get(cachedKey);
      if (existingSpotData) {
        return JSON.parse(existingSpotData);
      }
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
            label: exchange.name,
            assets: [] as IUnifiedAsset[],
            totalBalance: 0,
          };
          break;
      }
      await redis.set(cachedKey, JSON.stringify(spot), "EX", 60);
      return spot;
    })
  );
  return spotData;
};

export default getAllSpot;
