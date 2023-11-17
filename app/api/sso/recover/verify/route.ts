import { ForgetPasswordEmail } from "@/email-template/forget-password";
import { BASE, generateSecureOTP, resend } from "@/lib/core";
import prisma from "@/lib/prisma";
import { addSeconds } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
export const FORGET_PASSWORD_VERIFY_API_ROUTE = `${BASE}/api/sso/recover/verify`;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { email, state, otp } = payload;

    if (!email || !state || !otp)
      throw new Error("email and state doesn't exist!");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error("user doesn't exist!");

    const isVerifyRequest = await prisma.verificationToken.findUnique({
      where: {
        token: otp,
        state: state,
        email: email,
      },
    });

    if (!isVerifyRequest) throw new Error("No OTP Request found! Try again");

    // TODO: check expiring time and throw error
    // ??

    return NextResponse.json({
      message: "OTP is Valid",
    });
  } catch (error: any) {
    console.log("[FORGET_PASSWORD_VERIFY_POST_SERVER]", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
}
