"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { format, startOfWeek } from "date-fns"
import { getCurrentUser } from "@/features/auth/actions"

export async function createWeeklyReview(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const supabase = await createClient()
  const summary = formData.get("summary") as string
  const achievements = formData.get("achievements") as string
  const challenges = formData.get("challenges") as string
  const plan_for_next_week = formData.get("plan_for_next_week") as string
  
  const week_start_date = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")

  const { error } = await supabase
    .from("weekly_reviews")
    .upsert({ 
      user_id: user.id, 
      week_start_date,
      summary,
      achievements,
      challenges,
      plan_for_next_week
    }, { onConflict: "user_id, week_start_date" })

  if (error) return { error: error.message }
  revalidatePath("/weekly-review")
  return { success: true }
}