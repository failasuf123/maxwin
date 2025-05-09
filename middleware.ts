import { NextResponse } from "next/server";

export function middleware(req:any) {
  if (req.nextUrl.pathname === "/agoda-partner-verification") {
    return NextResponse.redirect(new URL("/AgodaPartnerVerification.htm", req.url));
  }
  if (req.nextUrl.pathname === "/zohoverify") {
    return NextResponse.redirect(new URL("/zohoverify/verifyforzoho.html", req.url));
  }
  return NextResponse.next();
}
