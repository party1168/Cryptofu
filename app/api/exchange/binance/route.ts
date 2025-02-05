import { NextResponse, NextRequest } from "next/server";
import { getBinanceSpot } from "@/lib/getBinanceSpot";
import { verifyToken } from "@/lib/auth";
import Exchange from "@/models/Exchange";
import { decryptAES } from "@/lib/rijindael";
import connectDB from "@/lib/db";
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
          message: "No Binance exchange found",
        },
        {
          status: 404,
        }
      );
    }
    const encryptedAPIkey = exchange.APIkey;
    const encryptedAPIsecret = exchange.APIsecret;
    const decryptedAPIkey = decryptAES(encryptedAPIkey);
    const decryptedAPIsecret = decryptAES(encryptedAPIsecret);
    const spotBalances = await getBinanceSpot(
      decryptedAPIkey,
      decryptedAPIsecret
    );
    return NextResponse.json(
      {
        success: true,
        data: spotBalances,
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
          message: (err as Error).message,
        },
        {
          status: 401,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: err,
        },
        {
          status: 400,
        }
      );
    }
  }
}
