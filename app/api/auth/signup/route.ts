import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import addUser from "@/lib/addUser";
/**
 * 處理用戶註冊的 POST 請求。
 *
 * @param {NextRequest} request - 包含請求數據的 Next.js 請求對象。
 * @returns {Promise<NextResponse>} 返回包含操作結果的 Next.js 響應對象。
 *
 * @throws {Error} 如果在處理請求時發生錯誤，將返回包含錯誤訊息的 500 響應。
 *
 * 此函數會執行以下步驟：
 * 1. 連接到資料庫。
 * 2. 從請求中解析 JSON 數據。
 * 3. 從數據中提取用戶名、電子郵件、密碼、錢包和交易所信息。
 * 4. 調用 `addUser` 函數來添加用戶。
 * 5. 根據 `addUser` 函數的返回值，返回相應的成功或失敗響應。
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const data = await request.json();
    const { name, email, password, wallet, exchange } = data;
    const isVerify = await addUser(name, email, password, wallet, exchange);
    if (isVerify) {
      return NextResponse.json(
        {
          success: true,
          message: "User added successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "User not added",
        },
        {
          status: 400,
        }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
