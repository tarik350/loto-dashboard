import { NextRequest, NextResponse } from "next/server";

const authPages = ["/login", "/forgot"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    if (authPages.includes(pathname)) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_REDIRECT_BASE_URL}/dashboard`
      );
    } else {
      return NextResponse.next();
    }
  } else {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_REDIRECT_BASE_URL}/login`
      );
    } else {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/:path*"],
};
