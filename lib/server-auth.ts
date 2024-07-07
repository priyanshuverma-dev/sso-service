"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE, BASE, User } from "./core";

export async function serverAuth(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE);
  if (!token) {
    return null;
  }

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
}
