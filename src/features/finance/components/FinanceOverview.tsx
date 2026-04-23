"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type Transaction = {
  amount: number
  category: string
  type: "income" | "expense"
}

export function FinanceOverview({ transactions }: { transactions: Transaction[] }) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)
  const balance = totalIncome - totalExpense

  // Chart data
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const chartData = Object.keys(expensesByCategory)
    .map(key => ({
      name: key,
      value: expensesByCategory[key]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Top 6

  const formatVND = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Số dư</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatVND(balance)}</div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-500">{formatVND(totalIncome)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Chi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-red-500">{formatVND(totalExpense)}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Chi tiêu theo danh mục (Top 6)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
                  <XAxis type="number" tickFormatter={(val) => `${val / 1000}k`} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value: number) => [formatVND(value), "Số tiền"]}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Chưa có dữ liệu chi tiêu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}