import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";
import addExchange from "@/lib/addExchange";
import { encryptAES } from "@/lib/rijindael";
import { verifyToken } from "@/lib/auth";
import { IExchange } from "@/models/Exchange";
/**
 * 處理 POST 請求以新增使用者的交易所資訊。
 *
 * @param {NextRequest} request - 請求物件，包含請求的詳細資訊。
 * @param {Object} context - 上下文物件，包含路由參數。
 * @param {Promise<{ uuid: string }>} context.params - 包含使用者電子郵件的路由參數。
 * @returns {Promise<NextResponse>} 回應物件，包含操作結果和狀態碼。
 *
 * @throws {Error} 如果授權標頭缺失或無效，將返回 401 狀態碼和錯誤訊息。
 * @throws {Error} 如果資料庫連接失敗或使用者未找到，將返回相應的狀態碼和錯誤訊息。
 * @throws {Error} 如果請求中缺少必需的欄位，將返回 400 狀態碼和錯誤訊息。
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
    const uuid = (await params).uuid;
    const user = await User.findOne({ uuid: uuid });
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
    const data = await request.json();
    const { name, APIkey, APIsecret } = data;
    if (!(name && APIkey && APIsecret)) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }
    const encryptedAPIkey = encryptAES(APIkey);
    const encryptedAPIsecret = encryptAES(APIsecret);
    const exchange = {
      userId: uuid,
      name,
      APIkey: encryptedAPIkey,
      APIsecret: encryptedAPIsecret,
      createAt: new Date(),
    };
    await addExchange((await params).uuid, exchange);
    return NextResponse.json(
      {
        success: true,
        message: "Exchange added successfully",
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
        status: 401,
      }
    );
  }
}
