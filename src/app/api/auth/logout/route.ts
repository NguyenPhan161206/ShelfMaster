import { logout } from "@/features/auth/actions"
import { NextResponse } from "next/server"

export async function POST() {
  await logout()
  // The logout function redirects, but if it doesn't (or for fetch API usage):
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}