import { NextRequest, NextResponse } from "next/server";
import { decryptAES } from "@/lib/utils/rijindael";
import Exchange from "@/models/Exchange";
import connectDB from "@/lib/database/db";
import getExchangeMaxTransaction from "@/lib/api/getMaxTransaction";
import { verifyToken } from "@/lib/utils/auth";

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
    const userExchange = await Exchange.findOne({
      userId: jwtData.uuid,
      name: "Max",
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
    const decryptedAPIkey = decryptAES(userExchange.APIkey);
    const decryptedAPIsecret = decryptAES(userExchange.APIsecret);
    const data = await getExchangeMaxTransaction(
      decryptedAPIkey,
      decryptedAPIsecret
    );
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
