import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";
import addExchange from "@/lib/addExchange";
import { encryptAES } from "@/lib/rijindael";
import { verifyToken } from "@/lib/auth";
import Exchange from "@/models/Exchange";

//取得用戶所有的交易所
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
    const exchanges = await Exchange.find({ userId: jwtData.uuid });
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
      userId: jwtData.uuid,
      name,
      APIkey: encryptedAPIkey,
      APIsecret: encryptedAPIsecret,
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
