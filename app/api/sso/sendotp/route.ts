import { ForgetPasswordEmail } from "@/email-template/forget-password";
import { BASE, generateSecureOTP, resend } from "@/lib/core";
import prisma from "@/lib/prisma";
import { addSeconds } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
export const SEND_OTP_API_ROUTE = `${BASE}/api/sso/sendotp`;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { email, state } = payload;

    if (!email || !state) throw new Error("email and state doesn't exist!");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error("user doesn't exist!");

    const newToken = generateSecureOTP();
    const expirationTime = addSeconds(new Date(), 600); // 600 seconds (10 minutes) from the current time

    const verificationCode = await prisma.verificationToken.create({
      data: {
        email,
        state,
        userId: user.id,
        token: newToken,
        expires: expirationTime,
      },
    });

    if (!verificationCode)
      throw new Error("Error in creating verification token");

    const { data, error } = await resend.emails.send({
      from: "GateSync Guard <security@gatesync.p7u.tech>",
      to: [email],
      subject: "Reset Password Request!",
      react: ForgetPasswordEmail({
        firstName: user.name,
        otp: newToken,
      }) as React.ReactElement,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({
      message: "Check you inbox. Email Sent",
      id: data?.id,
    });
  } catch (error: any) {
    console.log("[SEND_OTP_POST_SERVER]", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
}
