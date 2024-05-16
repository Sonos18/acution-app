import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/about", "/blog", "/auction", "/payment"];
const authPaths = ["/signin", "/signup"];
const adminPaths = ["/dashboard,/users"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;
  // Chưa đăng nhập thì không cho vào private paths
  if (!authPaths.some((path) => pathname.startsWith(path)) && !role) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  // Đăng nhập rồi thì không cho vào signin/signup nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && role) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Không phải admin thì không cho vào admin paths
  if (
    adminPaths.some((path) => pathname.startsWith(path)) &&
    role &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Không phải user thì không cho vào private paths
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    role &&
    role !== "user"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
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
    "/dashboard/:path*",
    "/users/:path*",
  ],
};
