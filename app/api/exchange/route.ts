import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exchange from "@/models/Exchange";
import { verifyToken } from "@/lib/auth";
import redis from "@/lib/redis";
import getAllSpot from "@/lib/getAllSpot";

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
    const existingData = await redis.get(jwtData.uuid);
    if (existingData) {
      return NextResponse.json(
        {
          success: true,
          data: JSON.parse(existingData),
        },
        {
          status: 200,
        }
      );
    }
    const data = await getAllSpot(userExchange);
    await redis.set(jwtData.uuid, JSON.stringify(data), "EX", 60);
    return NextResponse.json(
      {
        success: true,
        data,
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
