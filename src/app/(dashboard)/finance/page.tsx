import { createClient } from "@/lib/supabase/server"
import { TransactionList } from "@/features/finance/components/TransactionList"
import { CreateTransactionDialog } from "@/features/finance/components/CreateTransactionDialog"
import { FinanceOverview } from "@/features/finance/components/FinanceOverview"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { getCurrentUser } from "@/features/auth/actions"
import { redirect } from "next/navigation"

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  const params = await searchParams
  const dateParam = params.month ? new Date(params.month) : new Date()
  
  const startDate = format(startOfMonth(dateParam), "yyyy-MM-dd")
  const endDate = format(endOfMonth(dateParam), "yyyy-MM-dd")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tài chính</h1>
          <p className="text-muted-foreground mt-2">Quản lý thu chi tháng {format(dateParam, "MM/yyyy")}.</p>
        </div>
        <CreateTransactionDialog />
      </div>

      <div className="grid gap-6">
        <FinanceOverview transactions={transactions || []} />
        <TransactionList transactions={transactions || []} />
      </div>
    </div>
  )
}