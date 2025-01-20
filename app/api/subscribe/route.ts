import { NextRequest, NextResponse } from "next/server";
import subscribe from "@/lib/subscribe";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const email = data.email;
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }
    await subscribe(email);
    return NextResponse.json(
      {
        success: true,
        message: "Subscribed successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    if ((err as Error).message === "Subscriber already exists") {
      return NextResponse.json(
        {
          success: false,
          message: "此電子信箱已訂閱！",
        },
        {
          status: 401,
        }
      );
    }
    return NextResponse.json(
      {
        success: false,
        body: (err as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
