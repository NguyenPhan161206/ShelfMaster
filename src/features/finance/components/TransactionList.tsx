"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { deleteTransaction } from "@/features/finance/actions"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Transaction = {
  id: string
  amount: number
  category: string
  description: string | null
  type: "income" | "expense"
  date: string
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá giao dịch này?")) {
      startTransition(async () => {
        await deleteTransaction(id)
      })
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          Chưa có giao dịch nào trong tháng này.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Lịch sử giao dịch</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${t.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {t.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold">{t.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(t.date), "dd MMMM yyyy", { locale: vi })} {t.description && ` • ${t.description}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold ${t.type === "income" ? "text-green-500" : "text-foreground"}`}>
                  {t.type === "income" ? "+" : "-"}
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.amount)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 text-destructive"
                  onClick={() => handleDelete(t.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}