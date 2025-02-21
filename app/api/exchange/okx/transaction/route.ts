import getOkxTransaction from "@/lib/api/getOkxTransaction";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";
import connectDB from "@/lib/database/db";
import Exchange from "@/models/Exchange";
import { decryptAES } from "@/lib/utils/rijindael";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      {
        message: "Authorization header is required",
      },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    await connectDB();
    const jwtData = await verifyToken(token);
    const exchangeName = "OKX";
    const exchange = await Exchange.findOne({
      name: exchangeName,
      userId: jwtData.uuid,
    });
    if (!exchange) {
      return NextResponse.json(
        {
          message: "No exchange found",
        },
        { status: 404 }
      );
    }
    const transaction = await getOkxTransaction(
      decryptAES(exchange.APIkey),
      decryptAES(exchange.APIsecret),
      decryptAES(exchange.passphrase)
    );
    return NextResponse.json(
      {
        success: true,
        message: transaction,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          message: err.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: err,
        },
        { status: 500 }
      );
    }
  }
}
