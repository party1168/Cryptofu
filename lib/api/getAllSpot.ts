import { ExchangeParams, exchangeResponse } from "@/interfaces/exchange";
import getBinanceSpot from "./getBinanceSpot";
import getOkxSpot from "./getOkxSpot";
import getMaxSpot from "./getMaxSpot";
import { decryptAES } from "@/lib/utils/rijindael";
import redis from "../database/redis";

const getAllSpot = async (exchanges: ExchangeParams[]) => {
  const spotData = await Promise.all(
    exchanges.map(async (exchange: ExchangeParams) => {
      let spot: exchangeResponse;
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
            assets: [],
            totalBalance: 0,
          };
          break;
      }
      if (!spot) {
        throw new Error("Failed to fetch balances");
      }
      await redis.set(cachedKey, JSON.stringify(spot), "EX", 60);
      return spot;
    })
  );
  if (!spotData) {
    throw new Error("Failed to fetch balances");
  }
  return spotData;
};

export default getAllSpot;
