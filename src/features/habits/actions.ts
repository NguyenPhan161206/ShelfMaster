"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/features/auth/actions"

export async function createHabit(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const frequency = formData.get("frequency") as string || "daily"
  const reminder_time = formData.get("reminder_time") as string
  
  // Lấy danh sách các thứ lặp lại (nếu có)
  const repeat_days_raw = formData.get("repeat_days") as string
  const repeat_days = repeat_days_raw ? repeat_days_raw.split(",").map(Number) : null

  if (!title) return { error: "Tiêu đề không được để trống" }

  const { error } = await supabase
    .from("habits")
    .insert({ 
      user_id: user.id, 
      title, 
      description, 
      frequency,
      reminder_time: frequency === "daily" ? reminder_time : null,
      repeat_days: frequency === "weekly" ? repeat_days : null
    })

  if (error) return { error: error.message }
  revalidatePath("/habits")
  revalidatePath("/")
  return { success: true }
}

export async function toggleHabitLog(habitId: string, dateStr: string, isCompleted: boolean) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  if (isCompleted) {
    const { error } = await supabase
      .from("habit_logs")
      .insert({ user_id: user.id, habit_id: habitId, completed_at: dateStr })
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .match({ user_id: user.id, habit_id: habitId, completed_at: dateStr })
    if (error) return { error: error.message }
  }

  revalidatePath("/habits")
  revalidatePath("/")
  return { success: true }
}

export async function deleteHabit(habitId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const { error } = await supabase
    .from("habits")
    .delete()
    .match({ id: habitId, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath("/habits")
  revalidatePath("/")
  return { success: true }
}