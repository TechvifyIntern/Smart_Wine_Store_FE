import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode"; // Assuming jwt-decode can be used in middleware

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const adminPaths = ["/admin", "/admin/dashboard", "/admin/products", "/admin/accounts"]; // Add all relevant admin paths

  if (adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const token = request.cookies.get("token")?.value; // Assuming token is stored in cookies

    if (!token) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    try {
      const decoded = jwtDecode<{ roleId: number }>(token);
      const roleId = decoded.roleId;

      // Role.ADMIN = 1, Role.SELLER = 2, Role.USER = 3
      if (roleId !== 1 && roleId !== 2) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all paths under /admin
};
