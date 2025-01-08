import User from "@/app/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";

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
    const isVerify: boolean = bcrypt.compareSync(saltedPassword, existingUser.password);
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
