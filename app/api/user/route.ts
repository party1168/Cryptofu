import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/utils/auth";
import connectDB from "@/lib/database/db";
/**
 * @function GET
 * @description
 * 取得使用者資料的 API。此端點需要有效的 JWT token，
 * 並根據 token 中的 uuid 來找出對應的使用者資料。
 *
 * 說明：
 * - 從請求標頭中取得 "Authorization" 欄位，如無提供則回傳 401 錯誤。
 * - 從 "Authorization" 欄位中解析出 JWT token。
 * - 驗證 token 並連接資料庫。
 * - 根據 token 中的 uuid 進行使用者查詢，隱藏敏感資訊 (salt、password)。
 * - 若找不到使用者則回傳 404 錯誤，否則回傳使用者資料。
 *
 * @param {NextRequest} request - 傳入的請求物件，必須包含授權標頭。
 * @returns {NextResponse} 返回 JSON 格式的回應，其中包含使用者資料或錯誤訊息。
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
    const jwtData = await verifyToken(token);
    await connectDB();
    const user = await User.findOne(
      { uuid: jwtData.uuid },
      { salt: 0, password: 0 }
    );
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
/**
 * @function PATCH
 * @description
 * 更新使用者資料的 API。此端點需要有效的 JWT token，
 * 並禁止更新 uuid 與 email 欄位。
 *
 * 說明：
 * - 從請求標頭中取得 "Authorization" 欄位，如無提供則回傳 401 錯誤。
 * - 從 "Authorization" 欄位中解析出 JWT token。
 * - 驗證 token 並連接資料庫。
 * - 從請求中解析出傳入的更新資料，若無資料則回傳 400 錯誤。
 * - 若包含欲變更 uuid 或 email 則回傳 400 錯誤。
 * - 根據 token 中的 uuid 更新使用者資料，並且確保驗證規則被滿足。
 * - 更新成功後回傳更新後的使用者資料，若找不到使用者則回傳 404 錯誤。
 *
 * @param {NextRequest} request - 傳入的請求物件，必須包含更新資料與授權標頭。
 * @returns {NextResponse} 返回 JSON 格式的回應，其中包含更新後的使用者資料或錯誤訊息。
 */

export async function PATCH(request: NextRequest) {
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
    const jwtData = await verifyToken(token);
    await connectDB();
    const data = await request.json();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Data is required",
        },
        {
          status: 400,
        }
      );
    }
    if (data.uuid) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change the uuid",
        },
        {
          status: 400,
        }
      );
    }
    if (data.email) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change the email",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOneAndUpdate(
      { uuid: jwtData.uuid },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
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

/**
 * @function DELETE
 * @description
 * 刪除使用者資料的 API。此端點需要有效的 JWT token，
 * 並根據 token 中的 uuid 刪除對應的使用者。
 *
 * 說明：
 * - 從請求標頭中取得 "Authorization" 欄位，如無提供則回傳 401 錯誤。
 * - 從 "Authorization" 欄位中解析出 JWT token。
 * - 驗證 token 並連接資料庫。
 * - 根據 token 中的 uuid 找出並刪除對應的使用者。
 * - 若找不到使用者則回傳 404 錯誤，否則回傳成功刪除訊息。
 *
 * @param {NextRequest} request - 傳入的請求物件，必須包含授權標頭。
 * @returns {NextResponse} 返回 JSON 格式的回應，其中包含成功訊息或錯誤訊息。
 */
export async function DELETE(request: NextRequest) {
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
    const jwtData = await verifyToken(token);
    await connectDB();
    const deletedUser = await User.findOneAndDelete({ uuid: jwtData.uuid });
    if (!deletedUser) {
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
        message: "User deleted successfully",
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
