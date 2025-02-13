import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import addExchange from "@/lib/api/addExchange";
import { encryptAES } from "@/lib/utils/rijindael";
import { verifyToken } from "@/lib/utils/auth";
import Exchange from "@/models/Exchange";

/**
 * 處理 GET 請求以取得使用者的交易所資料。
 *
 * 此函式從請求標頭中擷取授權資訊並驗證 JWT token，
 * 接著連接資料庫並查詢與 JWT 對應的使用者的交易所記錄（隱藏 API 金鑰與密鑰）。
 * 若查無資料或驗證失敗，將回傳相應的錯誤訊息與 HTTP 狀態碼。
 *
 * @param request - Next.js NextRequest 物件，包含請求的相關資訊與標頭。
 * @returns NextResponse 物件，包含成功或錯誤的 JSON 回應。
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
    const exchanges = await Exchange.find(
      { userId: jwtData.uuid },
      { APIkey: 0, APIsecret: 0 }
    );
    if (exchanges.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No exchanges found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: exchanges,
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
          status: 500,
        }
      );
    }
  }
}
/**
 * 處理 POST 請求以新增使用者的交易所資料。
 *
 * 此函式從請求標頭中擷取授權資訊並驗證 JWT token，
 * 連接到資料庫後，從使用者傳遞的 JSON 主體中解析交易所相關資料（包括名稱、API 金鑰與 API 密鑰）。
 * API 金鑰與密鑰將使用 AES 加密後儲存。若缺少必要欄位、使用者不存在或驗證失敗，
 * 將回傳相應的錯誤訊息與 HTTP 狀態碼。
 *
 * @param request - Next.js NextRequest 物件，包含請求的相關資訊與 JSON 主體。
 * @returns NextResponse 物件，包含成功或錯誤的 JSON 回應。
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
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
    const { name, APIkey, APIsecret, passphrase } = data as {
      name: string;
      APIkey: string;
      APIsecret: string;
      passphrase?: string;
    };
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
    let encryptedPassphrase: string | undefined;
    if (passphrase) {
      encryptedPassphrase = encryptAES(passphrase);
    }
    const exchange = {
      userId: jwtData.uuid,
      name,
      APIkey: encryptedAPIkey,
      APIsecret: encryptedAPIsecret,
      ...(encryptedPassphrase && { passphrase: encryptedPassphrase }),
      createAt: new Date(),
    };
    await addExchange(jwtData.uuid, exchange);
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
/**
 * 處理 DELETE 請求以刪除使用者的交易所資料。
 *
 * 此函式從請求標頭中擷取授權資訊並驗證 JWT token，
 * 連接到資料庫後，從使用者傳遞的 JSON 主體中解析欲刪除交易所的 id，
 * 並刪除與使用者 ID 和該 id 匹配的交易所記錄。若資料缺失或找不到相對應的記錄，
 * 將回傳相應的錯誤訊息與 HTTP 狀態碼。
 *
 * @param request - Next.js NextRequest 物件，包含請求的相關資訊與 JSON 主體。
 * @returns NextResponse 物件，包含成功或錯誤的 JSON 回應。
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
    const data = await request.json();
    const { id } = data;
    if (!id) {
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
    const deletedExchange = await Exchange.findOneAndDelete({
      _id: id,
      userId: jwtData.uuid,
    });
    if (!deletedExchange) {
      return NextResponse.json(
        {
          success: false,
          message: "Exchange not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Exchange deleted successfully",
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
          status: 500,
        }
      );
    }
  }
}
