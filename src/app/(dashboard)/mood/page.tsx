import { createClient } from "@/lib/supabase/server"
import { MoodChart } from "@/features/mood/components/MoodChart"
import { subDays } from "date-fns"

export default async function MoodPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch journals from last 30 days for mood data
  const thirtyDaysAgo = subDays(new Date(), 30)
  
  const { data: journals } = await supabase
    .from("journals")
    .select("created_at, mood, energy_level")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cảm xúc & Năng lượng</h1>
        <p className="text-muted-foreground mt-2">Theo dõi sự thay đổi cảm xúc của bạn qua thời gian (30 ngày gần nhất).</p>
      </div>

      <MoodChart data={journals || []} />
    </div>
  )
}