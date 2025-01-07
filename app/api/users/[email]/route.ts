import User from "@/app/models/User";
import connectDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// 取得User的資料 By Email
export async function GET({ params }: { params: { email: string } }) {
  try {
    await connectDB();
    const email = (await params).email;
    const user = await User.find({ email: email });
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

// 修改User的資料 By Email
export async function POST(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const { name, email, password, wallet, exchange } = data;
    const user = await User.findOne({ email: (await params).email });
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
    if (wallet) user.wallet = wallet;
    if (exchange) user.exchange = exchange;

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

// 刪除User的資料 By Email
export async function DELETE({ params }: { params: { email: string } }) {
  try {
    await connectDB();
    const email = (await params).email;
    const user = await User.findOne({ email: email });
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
    await user.remove();
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
