import { NextResponse, NextRequest } from "next/server";
import { getBinanceSpot } from "@/lib/getBinanceSpot";
import { verifyToken } from "@/lib/auth";
import { IExchange } from "@/models/Exchange";
import { decryptAES } from "@/lib/rijindael";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { SpotBalance } from "@/lib/getBinanceSpot";
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

    const binanceExchange = user.exchange.filter(
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

    const allspot = await Promise.all(
      binanceExchange.map(async (exchange: IExchange) => {
        const encrypted_key = exchange.APIkey;
        const encrypted_secret = exchange.APIsecret;

        const decrypted_key = decryptAES(encrypted_key);
        const decrypted_secret = decryptAES(encrypted_secret);

        const spot = await getBinanceSpot(decrypted_key, decrypted_secret);
        return spot;
      })
    );

    let allBalances: SpotBalance[] = allspot.reduce((acc, spot) => {
      const existing = acc.find(
        (item: SpotBalance) => item.asset === spot.asset
      );
      if (existing) {
        existing.total = (
          Number(existing.total) + Number(spot.total)
        ).toString();
      } else {
        acc.push(spot);
      }
    });

    allBalances = allBalances.sort((a, b) => b.totalprice - a.totalprice);

    return NextResponse.json(
      {
        success: true,
        data: allBalances,
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
