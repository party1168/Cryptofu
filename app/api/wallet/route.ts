import { getWalletBalances } from "@/lib/api/getWalletBalances";
import connectDB from "@/lib/database/db";
import Wallet from "@/models/Wallet";
import { verifyToken } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";
/**
 * 處理 GET 請求以取得指定地址的錢包餘額。
 *
 * 此函數將進行以下操作：
 * - 檢查 Authorization 標頭是否存在，若缺少則回應 401 狀態碼。
 * - 從 Authorization 標頭中解析出 token，並驗證該 token。
 * - 從查詢參數中取得用戶指定的地址；若缺少地址則回應 400 狀態碼。
 * - 根據從 token 中取得的用戶 ID 與指定地址，查詢資料庫中的錢包資訊；若找不到則回應 404 狀態碼。
 * - 呼叫 getWalletBalances 函式取得錢包餘額；若無相關餘額則回應 404 狀態碼。
 * - 成功取得錢包餘額後，以 200 狀態碼回應查詢結果。
 * - 捕捉並處理任何可能發生的錯誤，錯誤時回應 401 狀態碼並附上錯誤訊息。
 *
 * @param request - Next.js 的 NextRequest 物件，包含 HTTP 請求相關資訊。
 * @returns 回傳一個 NextResponse JSON 物件，包含操作結果與適當的 HTTP 狀態碼。
 */
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
    const address = request.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required",
        },
        {
          status: 400,
        }
      );
    }
    const wallet = await Wallet.findOne({
      userId: jwtData.uuid,
      address: address,
    });
    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        {
          status: 404,
        }
      );
    }
    const balances = await getWalletBalances(address);
    if (!balances) {
      return NextResponse.json(
        {
          success: false,
          message: "No balances found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: balances,
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
          status: 401,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: err,
        },
        {
          status: 401,
        }
      );
    }
  }
}
