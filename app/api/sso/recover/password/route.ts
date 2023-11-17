import { hashPassword } from "@/app/api/login/route";
import { ForgetPasswordEmail } from "@/email-template/forget-password";
import { PasswordChangedEmail } from "@/email-template/password-changed";
import { BASE, generateSecureOTP, resend } from "@/lib/core";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { addSeconds } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
export const FORGET_PASSWORD_RESET_API_ROUTE = `${BASE}/api/sso/recover/password`;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { email, state, otp, password } = payload;

    if (!email || !state || !otp || !password)
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

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = hashPassword(password, user.salt);

    if (user.hashedPassword === hashedPassword)
      throw new Error("You can't use you old password!😂");

    const userWithNewPassword = await prisma.user.update({
      where: {
        email,
      },
      data: {
        hashedPassword,
        salt,
      },
    });

    if (!userWithNewPassword)
      throw new Error("Error in resetting password. try after some time");

    const { data, error } = await resend.emails.send({
      from: "GateSync Guard <security@gatesync.p7u.tech>",
      to: [email],
      subject: "Alert! Password Changed",
      react: PasswordChangedEmail({
        firstName: user.name,
      }) as React.ReactElement,
    });
    if (error) throw new Error(error.message);

    // delete Verification Request
    await prisma.verificationToken.delete({
      where: {
        userId: user.id,
        state: state,
        token: otp,
      },
    });

    return NextResponse.json({
      message: "Password Reset Successfully",
      id: data?.id,
    });
  } catch (error: any) {
    console.log("[FORGET_PASSWORD_CREATE_POST_SERVER]", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
}
