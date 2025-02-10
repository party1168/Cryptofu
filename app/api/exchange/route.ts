import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exchange from "@/models/Exchange";
import { verifyToken } from "@/lib/auth";
import { decryptAES } from "@/lib/rijindael";
import getOkxSpot from "@/lib/getOkxSpot";
import { ExchangeParams } from "@/lib/addExchange";
import { getBinanceSpot } from "@/lib/getBinanceSpot";
import { SpotBalance } from "@/lib/getBinanceSpot";
import redis from "@/lib/redis";

interface exchangeResponse {
  exchange: string;
  assets: SpotBalance[];
  totalBalance: number;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      {
        success: false,
        message: "Authorization header is required",
      },
      {
        status: 401,
      }
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const jwtData = await verifyToken(token);
    await connectDB();
    const userExchange = await Exchange.find({
      userId: jwtData.uuid,
    });
    if (!userExchange) {
      return NextResponse.json(
        {
          success: false,
          message: "No exchange found",
        },
        {
          status: 404,
        }
      );
    }
    const existingData = await redis.get(jwtData.uuid);
    if (existingData) {
      return NextResponse.json(
        {
          success: true,
          data: JSON.parse(existingData),
        },
        {
          status: 200,
        }
      );
    }
    const spotData = await Promise.all(
      userExchange.map(async (exchange: ExchangeParams) => {
        let spot: exchangeResponse;
        if (exchange.name === "OKX") {
          if (!exchange.passphrase) {
            throw new Error("Passphrase is required for OKX");
          }
          spot = await getOkxSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret),
            decryptAES(exchange.passphrase)
          );
        } else if (exchange.name === "Binance") {
          spot = await getBinanceSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret)
          );
        } else {
          spot = {
            exchange: exchange.name,
            assets: [],
            totalBalance: 0,
          };
        }
        if (!spot) {
          throw new Error("Failed to fetch balances");
        }
        return spot;
      })
    );
    if (!spotData) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch balances",
        },
        {
          status: 500,
        }
      );
    }

    const spotwTotal = spotData
      .reduce((sum, spot) => sum + spot.totalBalance, 0)
      .toFixed(2);
    const data = {
      spotData,
      totalBalance: Number(spotwTotal),
    };
    await redis.set(
      `${jwtData.uuid}@exchange`,
      JSON.stringify(data),
      "EX",
      300
    );
    return NextResponse.json(
      {
        success: true,
        data: { spotData, totalBalance: Number(spotwTotal) },
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: err.message,
        },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: err,
        },
        {
          status: 500,
        }
      );
    }
  }
}
