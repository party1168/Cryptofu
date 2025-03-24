import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";
import Exchange from "@/models/Exchange";
import getBinanceTransaction from "@/lib/api/getBinanceTransaction";
import connectDB from "@/lib/database/db";
import { decryptAES } from "@/lib/utils/rijindael";

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
    const exchange = await Exchange.findOne({
      userId: jwtData.uuid,
      name: "Binance",
    });
    if (!exchange) {
      return NextResponse.json(
        {
          success: false,
          message: "Exchange not found",
        },
        {
          status: 404,
        }
      );
    }
    const binanceTransaction = await getBinanceTransaction(
      decryptAES(exchange.APIkey),
      decryptAES(exchange.APIsecret)
    );
    return NextResponse.json({
      success: true,
      data: binanceTransaction,
    });
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
