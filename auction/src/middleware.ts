import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/about", "/blog", "/auction"];
const authPaths = ["/signin", "/signup"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  // Chưa đăng nhập thì không cho vào private paths
  if (
    (privatePaths.some((path) => pathname.startsWith(path)) ||
      pathname === "/") &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  // Đăng nhập rồi thì không cho vào signin/signup nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/about",
    "/blog/:path*",
    "/auction/:path*",
    "/",
    "/payment/:path*",
  ],
};
