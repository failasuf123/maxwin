import { NextResponse } from "next/server";

export function middleware(req:any) {
  if (req.nextUrl.pathname === "/agoda-partner-verification") {
    return NextResponse.redirect(new URL("/AgodaPartnerVerification.htm", req.url));
  }
  return NextResponse.next();
}
