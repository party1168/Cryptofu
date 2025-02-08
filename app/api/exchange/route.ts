import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exchange from "@/models/Exchange";
import { verifyToken } from "@/lib/auth";
import { decryptAES } from "@/lib/rijindael";
import getOkxSpot from "@/lib/getOkxSpot";
import { ExchangeParams } from "@/lib/addExchange";
import { getBinanceSpot } from "@/lib/getBinanceSpot";

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
    const spotData = await Promise.all(
      userExchange.map((exchange: ExchangeParams) => {
        if (exchange.name === "OKX") {
          if (!exchange.passphrase) {
            return NextResponse.json(
              {
                success: false,
                message: "Passphrase is required",
              },
              {
                status: 401,
              }
            );
          }
          return getOkxSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret),
            decryptAES(exchange.passphrase)
          );
        } else if (exchange.name === "Binance") {
          return getBinanceSpot(
            decryptAES(exchange.APIkey),
            decryptAES(exchange.APIsecret)
          );
        }
      })
    );
    return NextResponse.json(
      {
        success: true,
        data: spotData,
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
