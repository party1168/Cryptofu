import User from "@/app/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
/**
 * 處理用戶登入請求的 POST 方法。
 *
 * @param {NextRequest} request - 包含用戶登入資訊的請求物件。
 * @returns {Promise<NextResponse>} 返回包含登入結果的回應物件。
 *
 * @remarks
 * 此方法會檢查請求的 Authorization 標頭，並驗證 JWT 令牌。
 * 如果令牌有效，會連接到資料庫並檢查用戶的電子郵件和密碼。
 * 密碼會與資料庫中的加鹽密碼進行比對。
 *
 * @throws {Error} 如果資料庫連接失敗或其他錯誤發生，會返回 500 狀態碼和錯誤訊息。
 */
export async function POST(request: NextRequest) {
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
    user = verifyToken(token);
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
    await connectDB();
    const { email, password } = await request.json();
    const account = email;
    if (!account) {
      return NextResponse.json(
        {
          success: false,
          message: "Account number is required",
        },
        {
          status: 400,
        }
      );
    }
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
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
    const saltedPassword: string =
      existingUser.salt + password + existingUser.uuid;
    const isVerify: boolean = bcrypt.compareSync(
      saltedPassword,
      existingUser.password
    );
    console.log(password);
    console.log(saltedPassword);
    if (isVerify) {
      return NextResponse.json(
        {
          success: true,
          message: "Login success",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Login failed",
        },
        {
          status: 401,
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
