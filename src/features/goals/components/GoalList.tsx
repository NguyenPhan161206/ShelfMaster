"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { updateGoalProgress, deleteGoal } from "@/features/goals/actions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Trash2, Calendar, Target } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

type Goal = {
  id: string
  title: string
  description: string | null
  target_date: string | null
  status: "todo" | "in_progress" | "completed" | "cancelled"
  progress_percent: number
  created_at: string
}

const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "todo": { label: "Cần làm", variant: "secondary" },
  "in_progress": { label: "Đang tiến hành", variant: "default" },
  "completed": { label: "Hoàn thành", variant: "outline" },
  "cancelled": { label: "Đã huỷ", variant: "destructive" },
}

export function GoalList({ goals }: { goals: Goal[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá mục tiêu này?")) {
      startTransition(async () => {
        await deleteGoal(id)
      })
    }
  }

  const handleProgressChange = (id: string, val: number) => {
    startTransition(async () => {
      await updateGoalProgress(id, val)
    })
  }

  if (goals.length === 0) {
    return (
      <div className="col-span-full text-center py-12 border rounded-xl border-dashed">
        <p className="text-muted-foreground">Chưa có mục tiêu nào. Hãy đặt ra một đích đến mới!</p>
      </div>
    )
  }

  return (
    <>
      {goals.map((goal) => (
        <Card key={goal.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="line-clamp-2 leading-tight">{goal.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 -mt-2 -mr-2 text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(goal.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {goal.description || "Không có mô tả."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 mt-auto">
            <div className="flex justify-between text-sm mb-2 text-muted-foreground">
              <span>Tiến độ</span>
              <span className="font-medium text-foreground">{goal.progress_percent}%</span>
            </div>
            <Progress value={goal.progress_percent} className="h-2 mb-4" />
            <Slider 
              defaultValue={[goal.progress_percent]} 
              max={100} 
              step={5} 
              onValueCommit={(val) => handleProgressChange(goal.id, val[0])}
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center text-sm text-muted-foreground border-t bg-muted/20 px-6 py-3 mt-auto">
             <div className="flex items-center gap-1.5">
               <Calendar className="w-4 h-4" />
               {goal.target_date ? format(new Date(goal.target_date), "dd/MM/yyyy") : "Không thời hạn"}
             </div>
             <Badge variant={statusMap[goal.status]?.variant || "default"}>
               {statusMap[goal.status]?.label}
             </Badge>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}