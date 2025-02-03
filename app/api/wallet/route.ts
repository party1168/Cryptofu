import { getWalletBalances } from "@/lib/getWalletBalances";
import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
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
    await connectDB();
    const jwtData = await verifyToken(token);
    const address = request.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required",
        },
        {
          status: 400,
        }
      );
    }
    const wallet = await Wallet.findOne({
      userId: jwtData.uuid,
      address: address,
    });
    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        {
          status: 404,
        }
      );
    }
    const balances = await getWalletBalances(address);
    if (!balances) {
      return NextResponse.json(
        {
          success: false,
          message: "No balances found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: balances,
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


