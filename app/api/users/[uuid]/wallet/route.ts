import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import addWallet from "@/lib/addWallet";

//取得用戶所有的錢包


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
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
    const uuid = (await params).uuid;
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
    const data = await request.json();
    const { label, address, blockchain, type } = data;
    const wallet = {
      userId: uuid,
      label,
      address,
      blockchain,
      type,
      createAt: new Date(),
    };
    await addWallet(uuid, wallet);
    return NextResponse.json(
      {
        success: true,
        message: "Wallet added successfully",
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
