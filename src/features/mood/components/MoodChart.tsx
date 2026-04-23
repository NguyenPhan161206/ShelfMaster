"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

const moodScore: Record<string, number> = {
  happy: 5,
  neutral: 3,
  sad: 1,
  stressed: 2,
  angry: 1
}

const moodLabel: Record<number, string> = {
  5: "😄 Vui vẻ",
  3: "😐 Bình thường",
  2: "😫 Căng thẳng",
  1: "😢 Buồn/Giận",
}

export function MoodChart({ data }: { data: any[] }) {
  // Aggregate by day
  const chartDataMap = data.reduce((acc, curr) => {
    const date = format(new Date(curr.created_at), "dd/MM")
    if (!acc[date]) {
      acc[date] = { date, moodScore: 0, energy: 0, count: 0 }
    }
    
    if (curr.mood && moodScore[curr.mood]) {
      acc[date].moodScore += moodScore[curr.mood]
      acc[date].count += 1
    }
    if (curr.energy_level) {
       acc[date].energy += curr.energy_level
    }
    
    return acc
  }, {} as Record<string, any>)

  const chartData = Object.values(chartDataMap).map((d: any) => ({
    date: d.date,
    mood: d.count > 0 ? Math.round(d.moodScore / d.count) : null,
    energy: d.count > 0 ? Math.round(d.energy / d.count) : null,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(val) => moodLabel[val] || ""} stroke="hsl(var(--primary))" width={100} />
                <YAxis yAxisId="right" orientation="right" domain={[1, 10]} stroke="hsl(var(--destructive))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line yAxisId="left" type="monotone" dataKey="mood" name="Tâm trạng" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="energy" name="Năng lượng" stroke="hsl(var(--destructive))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chưa có đủ dữ liệu để vẽ biểu đồ. Hãy viết thêm nhật ký!
          </div>
        )}
      </CardContent>
    </Card>
  )
}