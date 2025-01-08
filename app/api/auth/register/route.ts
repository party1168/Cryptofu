import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import  addUser  from "@/app/lib/addUser";

// 新增一筆新的User資料
export async function POST(request: NextRequest) {
    try {
      await connectDB();
      const data = await request.json();
      const { name, email, password, wallet, exchange } = data;
      const isVerify = await addUser(name, email, password, wallet, exchange);
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
          message: (err as Error).message,
        },
        {
          status: 500,
        }
      );
    }
  }