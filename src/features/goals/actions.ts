"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/features/auth/actions"

export async function createGoal(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const target_date = formData.get("target_date") as string
  
  if (!title) return { error: "Tiêu đề không được để trống" }

  const { error } = await supabase
    .from("goals")
    .insert({ 
      user_id: user.id, 
      title, 
      description, 
      target_date: target_date || null 
    })

  if (error) return { error: error.message }
  revalidatePath("/goals")
  revalidatePath("/")
  return { success: true }
}

export async function updateGoalProgress(id: string, progress_percent: number) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  let status = "todo"
  if (progress_percent > 0 && progress_percent < 100) status = "in_progress"
  else if (progress_percent >= 100) status = "completed"

  const { error } = await supabase
    .from("goals")
    .update({ progress_percent, status })
    .match({ id, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath("/goals")
  revalidatePath("/")
  return { success: true }
}

export async function deleteGoal(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const { error } = await supabase
    .from("goals")
    .delete()
    .match({ id, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath("/goals")
  revalidatePath("/")
  return { success: true }
}