import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<NextResponse> {
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
    const user = await User.findOne({ uuid: (await params).uuid });
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
    const { name, address } = data;
    if (!name || !address) {
      throw new Error("Name and address are required");
    }
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Exchange added successfully",
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
          status: 500,
        }
      );
    }
  }
}
