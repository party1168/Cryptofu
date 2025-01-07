import { NextResponse, NextRequest } from "next/server";
import addUser from "@/app/lib/addUser";
import User from "@/app/models/User";
import connectDB from "@/app/lib/db";

interface UserQuery {
  email?: string;
  name?: string;
}

// 取得所有User的資料
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchUser = request.nextUrl.searchParams;
    const email = searchUser.get("email");
    const name = searchUser.get("name");

    const query: UserQuery = {};
    if (email) query.email = email;
    if (name) query.name = name;
    const users = await User.find(query);
    return NextResponse.json(
      {
        success: true,
        data: users,
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

// 新增一筆新的User資料
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { name, email, password, wallet, exchange } = data;
    const isVerify = await addUser(
      name,
      email,
      password,
      wallet,
      exchange
    );
    if (isVerify) {
      return NextResponse.json(
        {
          success: true,
          message: "User added successfully",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "User not added",
        },
        {
          status: 400,
        }
      );
    }
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
