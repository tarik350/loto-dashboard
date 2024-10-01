import { NextRequest, NextResponse } from "next/server";

const authPages = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("loggedIn")?.value === "true";
  const { pathname } = request.nextUrl;
  return NextResponse.next();

  // if (isAuthenticated) {
  //   if (authPages.includes(pathname)) {
  //     return NextResponse.redirect(
  //       `${process.env.NEXT_PUBLIC_REDIRECT_BASE_URL}/dashboard`
  //     );
  //   } else {
  //     return NextResponse.next();
  //   }
  // } else {
  //   if (pathname.startsWith("/dashboard")) {
  //     return NextResponse.redirect(
  //       `${process.env.NEXT_PUBLIC_REDIRECT_BASE_URL}/login`
  //     );
  //   } else {
  //     return NextResponse.next();
  //   }
  // }
}

export const config = {
  matcher: ["/dashboard/:path*", "/:path*"],
};
