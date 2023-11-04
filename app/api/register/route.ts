import { BASE, generateHash } from "@/lib/core";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { EMAIL_API_ROUTE } from "../send/route";

export const REGISTER_API_ROUTE = `${BASE}/api/register`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Check for an existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = hashPassword(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        salt,
      },
    });

    if (newUser) {
      const makeEmail = await fetch(EMAIL_API_ROUTE, {
        method: "POST",
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
        }),
      });

      const res = await makeEmail.json();
      console.log(res);
    }

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error(`USER_REGISTER_SERVER: ${error}`);

    return NextResponse.json(
      { message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

function hashPassword(password: string, salt: string): string {
  const hash = createHash("sha256");
  hash.update(password + salt);
  return hash.digest("hex");
}
