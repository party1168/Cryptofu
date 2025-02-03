import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import addWallet from "@/lib/addWallet";
import changeWallet from "@/lib/changeWallet";
/**
 * 處理 GET 請求以取得使用者的錢包資料。
 *
 * 此函式會先檢查請求標頭中是否包含 "Authorization"，接著從中解析出 JWT，
 * 並驗證該 token 是否有效。驗證成功後，將嘗試從資料庫中查找對應使用者的錢包資料。
 * 若未找到任何錢包資料，則回傳 404 狀態碼與錯誤訊息；若查詢成功，則回傳查詢到的錢包資料。
 *
 * @param request Next.js 的 NextRequest 物件，包含請求資訊與標頭。
 * @returns 回傳一個 NextResponse 物件，其中包含操作結果與相關狀態碼。
 * @throws 會在授權失敗或其他錯誤發生時，回傳相應的錯誤訊息。
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
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
    const wallets = await Wallet.find({ userId: jwtData.uuid });
    if (wallets.length === 0) {
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
    return NextResponse.json(
      {
        success: true,
        data: wallets,
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
 * 處理使用者的 POST 請求以新增錢包資料。
 *
 * 此函式首先從請求標頭中取得 "Authorization" 欄位，並從中解析出 JWT Token，接著驗證該 Token 是否有效。驗證通過後，
 * 會嘗試在資料庫中查找對應的使用者，若不存在則回傳 404 狀態與錯誤訊息。接下來，從請求主體中解析出錢包相關資料，
 * 包含 label、address、blockchain 以及 type，並將此資料與使用者 UUID 綁定後新增至資料庫中。若新增成功，
 * 則回傳一個包含成功訊息與 HTTP 200 狀態碼的 JSON 回應；若在執行過程中發生錯誤則回傳相應錯誤訊息與狀態碼。
 *
 * @param request - Next.js 的 NextRequest 物件，包含請求的相關資訊及主體資料。
 * @returns 一個 Promise，解析後回傳含有操作結果的 NextResponse 物件。
 *
 * @throws 當缺少 Authorization 標頭、驗證 JWT 失敗或使用者不存在時，會分別回傳相應的 401 或 404 HTTP 狀態碼與錯誤訊息。
 *         若在新增錢包資料過程中發生其他錯誤，將回傳 HTTP 500 狀態碼以及錯誤訊息。
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
    const user = await User.findOne({ uuid: jwtData.uuid });
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
    const { label, address, blockchain, type } = data;
    const wallet = {
      userId: jwtData.uuid,
      label,
      address,
      blockchain,
      type,
      createAt: new Date(),
    };
    await addWallet(jwtData.uuid, wallet);
    return NextResponse.json(
      {
        success: true,
        message: "Wallet added successfully",
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
          status: 500,
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
 * 更新錢包資訊的 PATCH 請求處理函數。
 *
 * @param {NextRequest} request - 包含請求資訊的 Next.js 請求物件。
 * @returns {Promise<NextResponse>} - 返回包含操作結果的 Next.js 回應物件。
 *
 * @remarks
 * 此函數會驗證請求中的授權標頭，並解析 JWT 以獲取使用者資訊。
 * 接著，會從請求的查詢參數中取得錢包 ID，並從請求主體中取得更新的錢包資料。
 * 最後，會調用 `changeWallet` 函數來更新錢包資訊，並返回操作結果。
 *
 * @throws {Error} - 如果授權標頭缺失或無效，會返回 401 狀態碼和錯誤訊息。
 * @throws {Error} - 如果缺少錢包 ID 或更新資料，會返回 400 狀態碼和錯誤訊息。
 * @throws {Error} - 如果更新操作失敗，會返回 400 狀態碼和錯誤訊息。
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
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
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "id is required",
        },
        {
          status: 400,
        }
      );
    }
    const data = await request.json();
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "wallet data is required",
        },
        {
          status: 400,
        }
      );
    }
    const updatedWallet = await changeWallet(
      { userId: jwtData.uuid, id: id },
      data
    );
    return NextResponse.json(
      {
        success: true,
        message: "Wallet updated successfully",
        data: updatedWallet,
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
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: err,
        },
        {
          status: 400,
        }
      );
    }
  }
}

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
    const deletedWallet = await Wallet.findOneAndDelete({
      _id: id,
      userId: jwtData.uuid,
    });
    if (!deletedWallet) {
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
    return NextResponse.json(
      {
        success: true,
        message: "Wallet deleted successfully",
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
          status: 400,
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
