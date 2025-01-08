import { getCryptoPricesApi } from "@/app/lib/getCryptoPrice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const response = await getCryptoPricesApi(params.symbol);
    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch crypto prices",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: response.data,
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
