import { getWalletBalances } from "@/lib/getWalletBalances";
import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import changeWallet from "@/lib/changeWallet";

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

export async function PATCH(request: NextRequest) {
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
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "id is required",
        },
        {
          status: 400,
        }
      );
    }
    const data = await request.json();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "wallet data is required",
        },
        {
          status: 400,
        }
      );
    }
    const updatedWallet = await changeWallet(
      { userId: jwtData.uuid, id: id },
      data
    );
    return NextResponse.json(
      {
        success: true,
        message: "Wallet updated successfully",
        data: updatedWallet,
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
          status: 400,
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
