import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./lib/core";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/",
    "/login",
    "/register",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const authRoutes = ["/login", "/register"];

  // Check for session
  const session = await getToken({ req });

  if (!session && !authRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && authRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
