import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/", "http://localhost:3000")
  );

  // Delete access token
  response.cookies.set("access", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  // Delete refresh token (if exists)
  response.cookies.set("refresh", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
