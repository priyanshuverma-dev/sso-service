import { AUTH_COOKIE, JWT_SECRET } from "@/lib/core";
import JWT from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = JWT.verify(token.replace("Bearer ", ""), JWT_SECRET);

    if (!decodedToken) {
      throw new Error("Token verification failed");
    }

    return NextResponse.json(decodedToken);
  } catch (error: any) {
    console.error(`VALIDATE_LOGIN_SERVER: ${error}`);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 401, // Unauthorized
      }
    );
  }
}
