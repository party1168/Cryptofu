import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Exchange from "@/models/Exchange";
import { verifyToken } from "@/lib/utils/auth";
import { decryptAES } from "@/lib/utils/rijindael";
import getOkxSpot from "@/lib/api/getOkxSpot";

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
    const exchangeName = "OKX";
    const exchange = await Exchange.findOne({
      userId: jwtData.uuid,
      name: exchangeName,
    });
    if (!exchange) {
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
    const spotData = await getOkxSpot(
      decryptAES(exchange.APIkey),
      decryptAES(exchange.APIsecret),
      decryptAES(exchange.passphrase)
    );

    return NextResponse.json(
      {
        success: true,
        data: spotData,
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
