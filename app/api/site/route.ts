import { NextRequest, NextResponse } from "next/server";
import cryptoRandomString from "crypto-random-string";
import db from "@/lib/db";
import { serverAuth } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const { name, url, callbackUrls } = await req.json();

    if (!name || !url) {
      throw new Error("Name and URL are required");
    }

    const user = await serverAuth();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const clientId = `sso-${cryptoRandomString({
      length: 32,
      type: "alphanumeric",
    })}-client.app`;
    const clientSecret = cryptoRandomString({ length: 64, type: "url-safe" });

    const site = await db.site.create({
      data: {
        name,
        url,
        siteUrl: [url],
        clientId,
        clientSecret,
        userId: user.id,
        callbackUrl: {
          set: callbackUrls,
        },
      },
    });

    return NextResponse.json({
      message: "Site created successfully",
      siteId: site.id,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
