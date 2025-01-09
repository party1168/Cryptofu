import { getCryptoPricesApi } from "@/app/lib/getCryptoPrice";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
/**
 * 處理 GET 請求以獲取加密貨幣價格。
 *
 * @param {NextRequest} request - 請求對象，包含請求的詳細信息。
 * @param {string} context.params.symbol - 加密貨幣的符號。
 * @returns {Promise<NextResponse>} 返回包含加密貨幣價格的 JSON 響應。
 *
 * @throws {Error} 如果驗證令牌失敗，返回 401 狀態碼和錯誤信息。
 * @throws {Error} 如果獲取加密貨幣價格失敗，返回 404 或 400 狀態碼和錯誤信息。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
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
    const response = await getCryptoPricesApi((await params).symbol);
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
