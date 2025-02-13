/**
 * 管理員用戶端點
 *
 * @module UserAdminAPI
 * @description 提供管理員修改和刪除用戶資料的API端點
 */
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/database/db";
import { verifyToken } from "@/lib/utils/auth";

/**
 * 修改用戶資料
 *
 * @async
 * @param {NextRequest} request - HTTP請求物件
 * @param {Object} params - URL參數
 * @param {string} params.email - 要修改的用戶電子郵件
 * @returns {Promise<NextResponse>} 包含操作結果的回應
 * @throws {Error} 當資料庫連接失敗或其他錯誤發生時
 *
 * @description
 * 允許管理員透過電子郵件修改用戶資料，可以更新以下欄位：
 * - name: 用戶名稱
 * - email: 電子郵件
 * - password: 密碼
 * - wallet: 錢包資訊
 * - exchange: 交易所資訊
 * - role: 用戶角色
 *
 * 需要在請求標頭中包含有效的管理員JWT令牌
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse> {
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
    const data = await request.json();
    const { name, email, password, wallet, exchange, role } = data;
    const user = await User.findOne({ email: (await params).email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (wallet) user.wallet = wallet;
    if (exchange) user.exchange = exchange;
    if (role) user.role = role;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
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

/**
 * 刪除用戶資料
 *
 * @async
 * @param {NextRequest} request - HTTP請求物件
 * @param {Object} params - URL參數
 * @param {string} params.email - 要刪除的用戶電子郵件
 * @returns {Promise<NextResponse>} 包含操作結果的回應
 * @throws {Error} 當資料庫連接失敗或其他錯誤發生時
 *
 * @description
 * 允許管理員透過電子郵件刪除用戶資料
 * 需要在請求標頭中包含有效的管理員JWT令牌
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse> {
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
    const email = (await params).email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    await user.remove();
    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
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
