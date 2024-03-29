import { AUTH_COOKIE, JWT_SECRET } from "@/lib/core";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";

export const SSO_RETRIVE_API_ROUTE = "http://domainone.com/api/sso/retrive";
export async function GET(req: NextRequest) {
  // const tempToken = req.headers.get("tempToken");
  // const tempToken = req.cookies.get(AUTH_COOKIE);
  try {
    const authorization = req.headers.get("authorization");

    if (!authorization) throw new Error("no authorization");

    const tempToken = authorization.replace("Bearer ", "");

    const decodeData = verify(tempToken, JWT_SECRET);
    if (!decodeData) throw new Error("Invalid Token");
    const uid = (decodeData as any).userId;

    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      throw new Error("User with this uid doesn't exist.", {
        cause: 400,
      });
    }

    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);

    const session = await prisma.session.create({
      data: { session: token, userId: user.id },
    });

    if (!session) {
      throw new Error("Error creating session.");
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: "",
      sub: session.session,
    });
  } catch (error: any) {
    console.log("RETRIVE_GET_SERVER", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
}
