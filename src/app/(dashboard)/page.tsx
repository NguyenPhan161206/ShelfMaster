import { createClient } from "@/lib/supabase/server"
import { format, subDays, startOfMonth } from "date-fns"
import { vi } from "date-fns/locale"
import { HabitList } from "@/features/habits/components/HabitList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckSquare, Wallet, BookHeart, Flame, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getCurrentUser } from "@/features/auth/actions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  const currentHour = new Date().getHours()
  let greeting = "Chào buổi tối"
  if (currentHour >= 5 && currentHour < 12) greeting = "Chào buổi sáng"
  else if (currentHour >= 12 && currentHour < 18) greeting = "Chào buổi chiều"

  // Ngày hiện tại và đầu tháng
  const todayDate = new Date()
  const todayStr = format(todayDate, "yyyy-MM-dd")
  const startOfMonthStr = format(startOfMonth(todayDate), "yyyy-MM-dd")

  // Fetch song song dữ liệu để tối ưu tốc độ
  const [
    { data: habits },
    { data: habitLogs },
    { data: transactions },
    { data: goals }
  ] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", user.id),
    supabase.from("habit_logs").select("*").eq("user_id", user.id).gte("completed_at", format(subDays(todayDate, 30), "yyyy-MM-dd")),
    supabase.from("transactions").select("*").eq("user_id", user.id).gte("date", startOfMonthStr),
    supabase.from("goals").select("*").eq("user_id", user.id).in("status", ["todo", "in_progress"])
  ])

  // Xử lý dữ liệu tổng hợp
  const todayLogs = habitLogs?.filter(l => l.completed_at === todayStr) || []
  const habitCompletionRate = habits?.length ? Math.round((todayLogs.length / habits.length) * 100) : 0
  
  const totalIncome = transactions?.filter(t => t.type === "income").reduce((acc, t) => acc + Number(t.amount), 0) || 0
  const totalExpense = transactions?.filter(t => t.type === "expense").reduce((acc, t) => acc + Number(t.amount), 0) || 0
  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, {user.full_name || "bạn"}! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Hôm nay là {format(todayDate, "EEEE, 'ngày' dd 'tháng' MM", { locale: vi })}.
          </p>
        </div>
      </div>
      
      {/* Thẻ chỉ số chính */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-teal-500/10 to-teal-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thói quen hôm nay</CardTitle>
            <CheckSquare className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length} / {habits?.length || 0}</div>
            <div className="flex items-center gap-2 mt-1">
               <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                 <div className="h-full bg-teal-500" style={{ width: `${habitCompletionRate}%` }} />
               </div>
               <span className="text-xs font-bold text-teal-600">{habitCompletionRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư tháng này</CardTitle>
            <Wallet className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}</div>
            <div className="flex items-center gap-4 mt-1 text-[10px] uppercase font-bold tracking-wider">
               <span className="text-green-600 flex items-center">
                 <ArrowUpRight className="w-3 h-3 mr-0.5" /> Thu: {new Intl.NumberFormat('vi-VN').format(totalIncome)}
               </span>
               <span className="text-red-600 flex items-center">
                 <ArrowDownRight className="w-3 h-3 mr-0.5" /> Chi: {new Intl.NumberFormat('vi-VN').format(totalExpense)}
               </span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mục tiêu active</CardTitle>
            <Target className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Mục tiêu đang thực hiện</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-rose-500/10 to-rose-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâm trạng & Nhật ký</CardTitle>
            <BookHeart className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Chưa viết</div>
            <p className="text-xs text-muted-foreground mt-1">Hãy dành 5 phút cho bản thân</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full rounded-2xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h2 className="font-bold text-xl flex items-center gap-2">
                 <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                 Theo dõi thói quen tuần này
               </h2>
               <p className="text-sm text-muted-foreground mt-1">Duy trì kỷ luật để đạt được mục tiêu dài hạn.</p>
             </div>
             <a href="/habits" className="text-sm font-medium text-primary hover:underline">Xem tất cả</a>
          </div>
          <HabitList habits={habits || []} logs={habitLogs || []} />
        </div>
      </div>
    </div>
  )
}