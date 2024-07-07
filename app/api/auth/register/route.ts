import { BASE, ValidateEmail } from "@/lib/core";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const REGISTER_API_ROUTE = `${BASE}/api/auth/register`;

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
    if (!ValidateEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Check for an existing user
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    // if (newUser) {
    //   const makeEmail = await fetch(EMAIL_API_ROUTE, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       name: newUser.name,
    //       email: newUser.email,
    //     }),
    //   });

    //   const res = await makeEmail.json();
    //   console.log(res);
    // }

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error(`USER_REGISTER_SERVER: ${error}`);

    return NextResponse.json(
      { message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
