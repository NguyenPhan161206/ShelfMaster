import { createClient } from "@/lib/supabase/server"
import { HabitList } from "@/features/habits/components/HabitList"
import { DailyTimeline } from "@/features/habits/components/DailyTimeline"
import { MonthlyCalendar } from "@/features/habits/components/MonthlyCalendar"
import { CreateHabitDialog } from "@/features/habits/components/CreateHabitDialog"
import { format, subDays, startOfMonth } from "date-fns"
import { getCurrentUser } from "@/features/auth/actions"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, LayoutList, Clock } from "lucide-react"

export default async function HabitsPage() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  const supabase = await createClient()

  // Fetch habits
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch habit logs (30 days for heatmap and calendar)
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 30)
  
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("completed_at", format(thirtyDaysAgo, "yyyy-MM-dd"))

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Thói quen</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi tiến độ kỷ luật của bạn.</p>
        </div>
        <CreateHabitDialog />
      </div>

      <Tabs defaultValue="week" className="w-full">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger value="day" className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4" /> 
              <span className="hidden sm:inline">Theo ngày</span>
              <span className="sm:hidden text-xs">Ngày</span>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <LayoutList className="w-4 h-4" /> 
              <span className="hidden sm:inline">Theo tuần</span>
              <span className="sm:hidden text-xs">Tuần</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <CalendarDays className="w-4 h-4" /> 
              <span className="hidden sm:inline">Theo tháng</span>
              <span className="sm:hidden text-xs">Tháng</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <DailyTimeline habits={habits || []} logs={logs || []} />
        </TabsContent>
        
        <TabsContent value="week" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-card border rounded-2xl shadow-sm p-4 md:p-6 overflow-hidden">
             <HabitList habits={habits || []} logs={logs || []} />
          </div>
        </TabsContent>

        <TabsContent value="month" className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <MonthlyCalendar logs={logs || []} totalHabitsCount={habits?.length || 0} />
        </TabsContent>
      </Tabs>
    </div>
  )
}