import User from "@/models/User";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * 處理 GET 請求以根據電子郵件地址獲取用戶資料。
 *
 * @param {NextRequest} request - 請求對象，包含請求頭和其他信息。
 * @param {Object} params - 路由參數對象。
 * @param {string} params.email - 用戶的電子郵件地址。
 * @returns {Promise<NextResponse>} 返回包含用戶資料的 JSON 響應。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
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
    await connectDB();
    const uuid = (await params).uuid;
    const user = await User.find({ uuid: uuid });
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
 * 處理 POST 請求以更新用戶資料。
 *
 * @param {NextRequest} request - 請求對象，包含請求頭和其他信息。
 * @param {Object} params - 路由參數對象。
 * @param {string} params.email - 用戶的電子郵件地址。
 * @returns {Promise<NextResponse>} 返回包含更新後用戶資料的 JSON 響應。
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
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
    await connectDB();
    const data = await request.json();
    const { name, email, password } = data;
    const user = await User.findOne({ email: (await params).uuid });
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
