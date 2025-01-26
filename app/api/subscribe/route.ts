import { NextRequest, NextResponse } from "next/server";
import subscribe from "@/lib/subscribe";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    const data = await request.json();
    const email = data.email;
    const recaptchaToken = data.recaptchaToken;
    if (!email || !recaptchaToken) {
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
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const recaptchaResponse = await axios.post(verifyUrl);
    const recaptchaData = recaptchaResponse.data;
    if (!recaptchaData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "ReCAPTCHA verification failed",
        },
        {
          status: 402,
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
