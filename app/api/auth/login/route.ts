import { AUTH_COOKIE, BASE, JWT_SECRET } from "@/lib/core";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";

export const LOGIN_API_ROUTE = `${BASE}/api/auth/login`;

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

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User with this email doesn't exist." },
        { status: 401 }
      );
    }

    const passwordCompare = await bcryptjs.compare(
      password,
      user.hashedPassword
    );

    if (!passwordCompare) {
      return NextResponse.json(
        { message: "Incorrect password. Try again." },
        { status: 401 }
      );
    }

    const token = JWT.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET
    );

    const session = await db.session.create({
      data: { session: token, userId: user.id },
    });

    if (!session) {
      throw new Error("Error creating session.");
    }

    return NextResponse.json(
      { message: "Access Granted!" },
      {
        headers: {
          "Set-Cookie": `${AUTH_COOKIE}=${session.session}; HttpOnly; Secure; SameSite=Strict; Path=/`,
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
