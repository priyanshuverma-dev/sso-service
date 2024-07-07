import { NextRequest } from "next/server";
// import { VALIDATE_API_ROUTE } from "@/app/api/validate/route";
// import { Resend } from "resend";
export const BASE = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET || "priyanshu";
export const AUTH_COOKIE = "__sso__secure_auth";
// export const resend = new Resend("re_aJnm41fF_Bf4erb91zXgP3Z92X9pTFab9");

export const BASE_PARAMS = (params: any) =>
  `client_id=${params?.client_id}&scope=${params?.scope}&response_type=${params?.response_type}&redirect_uri=${params?.redirect_uri}&state=${params.state}&client_secret=${params?.client_secret}`;

import { createHmac, randomBytes } from "crypto";
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
      const res = await fetch(`${BASE}/api/auth/validate`, {
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

export function getCharFromName(name: string) {
  const nameSpilt = name.split(" ");

  if (nameSpilt.length > 1) {
    const firstChar = nameSpilt[0].at(0);
    const secChar = nameSpilt[1].at(0);
    return `${firstChar}${secChar}`.toUpperCase();
  }

  const firstChar = nameSpilt[0].at(0);

  return `${firstChar}`.toUpperCase();
}

export function generateSecureOTP() {
  // Generate a cryptographically secure random buffer of 3 bytes (24 bits)
  const buffer = randomBytes(3);

  // Convert the buffer to a 6-digit OTP (decimal representation)
  const otp = buffer.readUIntBE(0, 3) % 1000000;

  // Pad the OTP with leading zeros if necessary
  return otp.toString().padStart(6, "0");
}
