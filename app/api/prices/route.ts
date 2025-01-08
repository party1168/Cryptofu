import { NextRequest, NextResponse } from "next/server";
import { getAllCryptoPricesApi } from "@/app/lib/getAllCrypto";

export async function GET(request: NextRequest) {
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
