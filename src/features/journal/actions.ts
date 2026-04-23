"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/features/auth/actions"

export async function createJournal(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const content = formData.get("content") as string
  const mood = formData.get("mood") as string
  const energy_level = parseInt(formData.get("energy_level") as string)
  const tagsStr = formData.get("tags") as string
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []

  if (!content) return { error: "Nội dung không được để trống" }

  const { error } = await supabase
    .from("journals")
    .insert({ user_id: user.id, content, mood, energy_level: isNaN(energy_level) ? null : energy_level, tags })

  if (error) return { error: error.message }
  revalidatePath("/journal")
  revalidatePath("/mood")
  return { success: true }
}

export async function deleteJournal(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const { error } = await supabase
    .from("journals")
    .delete()
    .match({ id, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath("/journal")
  revalidatePath("/mood")
  return { success: true }
}