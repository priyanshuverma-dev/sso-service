export const BASE = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET || "priyanshu";
export const AUTH_COOKIE = "__SecureAuth";

import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { VALIDATE_API_ROUTE } from "@/app/api/validate/route";
export function generateHash(salt: string, password: string) {
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hashedPassword;
}

export function ValidateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return {
      message: "You have entered an valid email address!",
      status: true,
    };
  }
  return {
    message: "You have entered an invalid email address!",
    status: false,
  };
}
export async function getToken({
  req,
}: {
  req: NextRequest;
}): Promise<any | null> {
  const token = req.cookies.get(AUTH_COOKIE);

  if (token) {
    try {
      const res = await fetch(VALIDATE_API_ROUTE, {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      });

      if (res.status === 200) {
        const body = await res.json();
        return body;
      } else {
        console.error(`Token validation failed with status code ${res.status}`);
        return null;
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      return null;
    }
  } else {
    return null;
  }
}