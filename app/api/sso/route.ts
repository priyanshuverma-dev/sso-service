import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { addSeconds } from "date-fns"; // You may need to import date-fns or a similar library for date manipulation
import { decode, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/core";
import { hashPassword } from "../login/route";

export const SSO_API_ROUTE = "http://domainone.com/api/sso";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { domain, clientId, token, state, scope, clientSecret } = payload;

    if (!domain || !clientId || !token || !state) {
      throw new Error("No complete");
    }

    const exists = await prisma.sSOToken.findUnique({
      where: {
        token: token,
      },
    });

    if (exists) {
      return NextResponse.json(exists);
    }

    const decodeData = verify(token, JWT_SECRET);
    if (!decodeData) throw new Error("Invalid Token");
    const userId = (decodeData as any).id;

    const tempToken = sign(
      {
        clientId: clientId,
        state: state,
        userId: userId,
      },
      JWT_SECRET
    );

    const expirationTime = addSeconds(new Date(), 300); // 300 seconds (5 minutes) from the current time

    const temp = await prisma.sSOToken.create({
      data: {
        clientId,
        scope,
        token: tempToken,
        expires: expirationTime,
        identifier: state,
      },
    });
    if (!temp) throw new Error("Error in creating temp token");
    return NextResponse.json({
      state: state,
      temp,
    });
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
