import { AUTH_COOKIE, JWT_SECRET } from "@/lib/core";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";

export const VALIDATE_API_ROUTE = "https://localhost:3000/api/validate";

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

    return NextResponse.json(decodedToken, {
      headers: {
        "Set-Cookie": `${AUTH_COOKIE}=${decodedToken}; max-age=3600; HttpOnly; Secure; SameSite=Strict; Path=/`,
      },
    });
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
