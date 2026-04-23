"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const SESSION_COOKIE = "selfmaster_session"

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Query user directly from public.users
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !user) {
    redirect("/login?error=" + encodeURIComponent("Email hoặc mật khẩu không đúng"))
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    redirect("/login?error=" + encodeURIComponent("Email hoặc mật khẩu không đúng"))
  }

  // Set session cookie (In production, use JWT)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const full_name = formData.get("full_name") as string

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existingUser) {
    redirect("/register?error=" + encodeURIComponent("Email đã được sử dụng"))
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insert into public.users
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      email,
      password: hashedPassword,
      full_name,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`
    })
    .select()
    .single()

  if (error || !newUser) {
    redirect("/register?error=" + encodeURIComponent("Không thể tạo tài khoản: " + error?.message))
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value

  if (!userId) return null

  const supabase = await createClient()
  const { data: user } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url")
    .eq("id", userId)
    .single()

  return user
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const full_name = formData.get("full_name") as string
  const website = formData.get("website") as string

  const supabase = await createClient()
  const { error } = await supabase
    .from("users")
    .update({ full_name, avatar_url: website }) // Reusing website for simplicity or add field
    .eq("id", user.id)

  if (error) return { error: error.message }
  
  revalidatePath("/profile")
  revalidatePath("/", "layout")
  return { success: true }
}
