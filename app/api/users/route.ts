import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// 取得所有User的資料
/**
 * 處理 GET 請求以獲取用戶列表。
 *
 * @param {NextRequest} request - 包含請求詳細信息的 NextRequest 物件。
 * @returns {Promise<NextResponse>} 返回包含用戶列表或錯誤訊息的 NextResponse 物件。
 *
 * @remarks
 * 此函數首先檢查請求是否包含授權標頭。如果沒有授權標頭，則返回 401 狀態碼和錯誤訊息。
 * 接著，函數會驗證授權標頭中的 JWT 令牌。如果令牌無效或用戶角色不是 "admin"，則返回 401 狀態碼和錯誤訊息。
 * 最後，函數會連接到資料庫並獲取所有用戶的列表。如果發生錯誤，則返回 500 狀態碼和錯誤訊息。
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
  let user;
  try {
    user = await verifyToken(token);
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
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
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
        status: 500,
      }
    );
  }
}

