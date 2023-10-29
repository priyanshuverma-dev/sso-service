import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { addSeconds } from "date-fns"; // You may need to import date-fns or a similar library for date manipulation
import { decode, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/core";
import { hashPassword } from "../../login/route";

export const SSO_API_ROUTE = "http://domainone.com/api/sso";

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    const payload = new URLSearchParams(rawText);
    const token = payload.get("code");
    const grant_type = payload.get("grant_type");
    const domain = payload.get("redirect_uri");

    if (!token) {
      return NextResponse.json(
        { message: "No identifier Code provided" },
        { status: 401 }
      );
    }

    const ssoToken = await prisma.sSOToken.findUnique({
      where: {
        identifier: token,
      },
    });

    if (!ssoToken) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }

    const decodeData = verify(ssoToken.token, JWT_SECRET);

    if (!decodeData) throw new Error("Invalid Token");

    const userId = (decodeData as any).userId;

    // Token is valid, create a new JWT token and send it
    const jwtToken = sign(
      {
        clientId: ssoToken.clientId,
        userId: userId,
        identifierCode: token,
      },
      JWT_SECRET
    );
    // TODO:
    // !access_token?: string;
    // !token_type?: string;
    // !id_token?: string;
    // !refresh_token?: string;
    // !expires_in?: number;
    // !expires_at?: number;
    // !session_state?: string;
    // !scope?: string;

    return NextResponse.json({ access_token: jwtToken });
  } catch (error: any) {
    console.error(`SSO_SERVER_POST_ACCESSS: ${error}`);

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

export async function GET(req: NextRequest) {
  const identifierCode = req.headers.get("identifierCode");
  const clientId = req.headers.get("clientId");

  if (!identifierCode) {
    return NextResponse.json(
      { message: "No identifier Code provided" },
      { status: 401 }
    );
  }
  if (!clientId) {
    return NextResponse.json(
      { message: "No clientId provided" },
      { status: 401 }
    );
  }

  try {
    // Check if the token exists in your database
    const ssoToken = await prisma.sSOToken.findUnique({
      where: {
        identifier: identifierCode,
      },
    });

    if (!ssoToken) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }

    const decodeData = verify(ssoToken.token, JWT_SECRET);

    if (!decodeData) throw new Error("Invalid Token");

    const userId = (decodeData as any).userId;

    // Token is valid, create a new JWT token and send it
    const jwtToken = sign(
      {
        clientId: ssoToken.clientId,
        userId: userId,
        identifierCode: identifierCode,
      },
      JWT_SECRET
    );

    return NextResponse.json({ jwtToken });
  } catch (error: any) {
    console.error(`SSO_SERVER_GET: ${error}`);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500, // Internal Server Error
      }
    );
  }
}
