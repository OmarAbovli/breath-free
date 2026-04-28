import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const response = NextResponse.redirect(new URL(callbackUrl, request.url))

  // Determine cookie name based on environment
  const isSecure = request.url.startsWith("https://")
  const cookieName = isSecure ? "__Secure-next-auth.session-token" : "next-auth.session-token"

  // Set the session cookie
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })

  // Also set the non-secure one just in case if not secure
  if (!isSecure) {
    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    })
  }

  return response
}
