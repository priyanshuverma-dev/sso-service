import { AUTH_COOKIE, BASE, JWT_SECRET } from "@/lib/core";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";

export const LOGIN_API_ROUTE = `${BASE}/api/login`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User with this email doesn't exist." },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password, user.salt);

    if (user.hashedPassword !== hashedPassword) {
      return NextResponse.json(
        { message: "Incorrect password. Try again." },
        { status: 401 }
      );
    }

    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);

    const session = await prisma.session.create({
      data: { session: token, userId: user.id },
    });

    if (!session) {
      throw new Error("Error creating session.");
    }

    return NextResponse.json(
      { message: "Access Granted!" },
      {
        headers: {
          "Set-Cookie": `${AUTH_COOKIE}=${session.session}; HttpOnly; SameSite=Strict;Path=/`,
        },
      }
    );
  } catch (error) {
    console.error(`USER_LOGIN_SERVER: ${error}`);

    return NextResponse.json(
      { message: "Login failed. Please try again later." },
      { status: 500 }
    );
  }
}

function hashPassword(password: string, salt: string): string {
  const hash = createHash("sha256");
  hash.update(password + salt);
  return hash.digest("hex");
}
