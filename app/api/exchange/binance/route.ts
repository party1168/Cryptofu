import { NextResponse, NextRequest } from "next/server";
import { getBinanceSpot } from "@/lib/getBinanceSpot";
import { verifyToken } from "@/lib/auth";
import { IExchange } from "@/models/User";
import { decryptAES } from "@/lib/rijindael";
import User from "@/models/User";
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
    await verifyToken(token);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 401,
      }
    );
  }
  try {
    await connectDB();
    const uuid = request.nextUrl.searchParams.get("uuid");
    const user = await User.findOne({ uuid: uuid });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const binanceExchange = user.exchange.find(
      (exchange: IExchange) => exchange.name.toLowerCase() === "binance"
    );

    if (!binanceExchange) {
      return NextResponse.json(
        {
          success: false,
          message: "Binance exchange not found",
        },
        {
          status: 404,
        }
      );
    }

    const encrypted_key = binanceExchange.APIkey;
    const encrypted_secret = binanceExchange.APIsecret;

    const decrypted_key = decryptAES(encrypted_key);
    const decrypted_secret = decryptAES(encrypted_secret);

    const spot = await getBinanceSpot(decrypted_key, decrypted_secret);
    return NextResponse.json(
      {
        success: true,
        data: spot,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
