import { NextRequest, NextResponse } from "next/server";
import { getAllCryptoPricesApi } from "@/lib/api/getCryptoList";
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
    const response = await getAllCryptoPricesApi();
    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch cryptos",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 400,
      }
    );
  }
}
