"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/features/auth/actions"

export async function createTransaction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const amount = parseFloat(formData.get("amount") as string)
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as "income" | "expense"
  const date = formData.get("date") as string
  
  if (!amount || !category || !type || !date) return { error: "Thiếu thông tin bắt buộc" }

  const { error } = await supabase
    .from("transactions")
    .insert({ 
      user_id: user.id, 
      amount, 
      category, 
      description,
      type,
      date
    })

  if (error) return { error: error.message }
  revalidatePath("/finance")
  revalidatePath("/")
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const { error } = await supabase
    .from("transactions")
    .delete()
    .match({ id, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath("/finance")
  revalidatePath("/")
  return { success: true }
}