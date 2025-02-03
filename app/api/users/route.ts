import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";

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
