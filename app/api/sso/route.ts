import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { addSeconds } from "date-fns"; // You may need to import date-fns or a similar library for date manipulation
import { decode, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/core";

export const SSO_API_ROUTE = "http://domainone.com/api/sso";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { domain, clientId, token } = payload;
    if (!domain || !clientId || !token) {
      throw new Error("No complete");
    }

    const decodeData = verify(token, JWT_SECRET);
    if (!decodeData) throw new Error("Invalid Token");
    const userId = (decodeData as any).id;

    const tempToken = sign(
      {
        clientId: clientId,
        domain: domain,
        userId: userId,
      },
      JWT_SECRET
    );

    const expirationTime = addSeconds(new Date(), 300); // 300 seconds (5 minutes) from the current time

    const temp = await prisma.sSOToken.create({
      data: {
        clientId,
        domain,
        token: tempToken,
        expires: expirationTime,
      },
    });
    if (!temp) throw new Error("Error in creating temp token");
    console.log(temp);
    return NextResponse.json(temp);
  } catch (error: any) {
    console.error(`SSO_SERVER_POST: ${error}`);

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
  const tempToken = req.headers.get("temp-token");
  const clientId = req.headers.get("clientId");

  if (!tempToken) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
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
        token: tempToken,
        clientId,
      },
    });

    if (!ssoToken) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }

    // Check if the token has expired
    if (ssoToken.expires <= new Date()) {
      return NextResponse.json(
        { message: "Token has expired" },
        { status: 401 }
      );
    }

    // Token is valid, create a new JWT token and send it
    const jwtToken = sign(
      { clientId: ssoToken.clientId, domain: ssoToken.domain },
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
