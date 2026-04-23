import { createClient } from "@/lib/supabase/server"
import { GoalList } from "@/features/goals/components/GoalList"
import { CreateGoalDialog } from "@/features/goals/components/CreateGoalDialog"

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch goals
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mục tiêu</h1>
          <p className="text-muted-foreground mt-2">Theo dõi và đạt được những gì bạn mong muốn.</p>
        </div>
        <CreateGoalDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <GoalList goals={goals || []} />
      </div>
    </div>
  )
}