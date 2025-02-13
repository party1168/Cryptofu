import getAllSpot from "@/lib/api/getAllSpot";
import getAllWalletBalances from "@/lib/api/getAllWalletBalances";
import connectDB from "@/lib/database/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";
import Wallet from "@/models/Wallet";
import Exchange from "@/models/Exchange";

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
    const user = await User.findOne({ uuid: jwtData.uuid });
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
    const wallets = await Wallet.find({ userId: jwtData.uuid });
    const exchanges = await Exchange.find({ userId: jwtData.uuid });
    const walletBalances = await getAllWalletBalances(wallets);
    const exchangeBalances = await getAllSpot(exchanges);
    const walletValue = Number(
      walletBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const exchangeValue = Number(
      exchangeBalances
        .reduce((acc, curr) => {
          return acc + curr.totalBalance;
        }, 0)
        .toFixed(2)
    );
    const portfolioBalance = walletValue + exchangeValue;
    const portfolio = {
      walletBalances,
      exchangeBalances,
      portfolioBalance,
    };
    return NextResponse.json(
      {
        success: true,
        data: portfolio,
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
          status: 401,
        }
      );
    }
  }
}
