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
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  const authRoutes = ["/login", "/register"];

  // Check for subdomain validation
  const subdomain = hostname.split(".")[0];

  if (subdomain === "invalidsubdomain") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check for session
  const session = await getToken({ req });

  if (!session && !authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(path === "/" ? "" : path, req.url));
  }

  // Rewrite everything else to `/[domain]/[slug]` dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
