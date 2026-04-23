"use client"

import { useState, useTransition } from "react"
import { format, subDays, isSameDay, parseISO, differenceInDays } from "date-fns"
import { vi } from "date-fns/locale"
import { toggleHabitLog, deleteHabit } from "@/features/habits/actions"
import { Button } from "@/components/ui/button"
import { Trash2, Flame, Calendar as CalendarIcon, Clock, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Habit = {
  id: string
  title: string
  description: string | null
  frequency: string
  reminder_time: string | null
  repeat_days: number[] | null
}

type HabitLog = {
  habit_id: string
  completed_at: string
}

interface HabitListProps {
  habits: Habit[]
  logs: HabitLog[]
}

const dayLabels: Record<number, string> = {
  1: "T2", 2: "T3", 3: "T4", 4: "T5", 5: "T6", 6: "T7", 7: "CN"
}

export function HabitList({ habits, logs }: HabitListProps) {
  const [isPending, startTransition] = useTransition()
  
  const today = new Date()
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i))
  const last30Days = Array.from({ length: 30 }).map((_, i) => subDays(today, 29 - i))

  const handleToggle = (habitId: string, dateStr: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleHabitLog(habitId, dateStr, !currentStatus)
    })
  }

  const handleDelete = (habitId: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá thói quen này?")) {
      startTransition(async () => {
        await deleteHabit(habitId)
      })
    }
  }

  const getStreak = (habitId: string) => {
    const habitLogs = logs
      .filter(l => l.habit_id === habitId)
      .map(l => l.completed_at)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (habitLogs.length === 0) return 0

    let streak = 0
    let checkDate = new Date()
    const todayStr = format(today, "yyyy-MM-dd")
    if (!habitLogs.includes(todayStr)) {
      checkDate = subDays(today, 1)
    }

    for (let i = 0; i < 365; i++) {
      const dateStr = format(checkDate, "yyyy-MM-dd")
      if (habitLogs.includes(dateStr)) {
        streak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }
    return streak
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-secondary p-4 rounded-full mb-4">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Chưa có thói quen nào.</p>
        <p className="text-sm text-muted-foreground">Hãy thêm mới để bắt đầu hành trình kỷ luật.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {habits.map((habit) => {
        const streak = getStreak(habit.id)
        
        return (
          <div key={habit.id} className="group border rounded-2xl p-4 md:p-6 bg-card transition-all hover:border-primary/20 hover:shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight">{habit.title}</h3>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold border border-orange-200">
                      <Flame className="w-3 h-3 fill-orange-500" />
                      STREAK: {streak}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                   {habit.frequency === "daily" && habit.reminder_time && (
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" /> {habit.reminder_time}
                     </div>
                   )}
                   {habit.frequency === "weekly" && habit.repeat_days && (
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                        <CalendarDays className="w-3 h-3" /> 
                        {habit.repeat_days.sort().map(d => dayLabels[d]).join(", ")}
                     </div>
                   )}
                </div>

                {habit.description && <p className="text-muted-foreground text-sm mt-3 line-clamp-2 italic">{habit.description}</p>}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-muted/30 rounded-xl p-1.5 border">
                  {last7Days.map((date, i) => {
                    const dateStr = format(date, "yyyy-MM-dd")
                    const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === dateStr)
                    const isToday = i === 6
                    
                    // Logic check xem ngày này có thuộc lịch lặp lại không
                    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
                    const isScheduled = habit.frequency === "daily" || (habit.repeat_days?.includes(dayOfWeek))

                    return (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleToggle(habit.id, dateStr, isCompleted)}
                            disabled={isPending}
                            className={cn(
                              "w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all relative border border-transparent",
                              isCompleted 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : isScheduled 
                                  ? "hover:bg-secondary text-foreground hover:border-primary/20" 
                                  : "opacity-30 grayscale cursor-default",
                              isToday && !isCompleted && isScheduled && "ring-2 ring-primary ring-inset",
                              isPending && "opacity-50"
                            )}
                          >
                            <span className="text-[10px] uppercase font-bold opacity-70">
                              {format(date, "EE", { locale: vi })}
                            </span>
                            <span className="text-xs font-black">
                              {isCompleted ? "✓" : format(date, "d")}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{format(date, "EEEE, dd/MM/yyyy", { locale: vi })}</p>
                          {!isScheduled && <p className="text-[10px] text-destructive">Không có lịch lặp lại</p>}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(habit.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Heatmap 30 ngày */}
            <div className="space-y-2 pt-4 border-t border-dashed">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/60">
                <span>Lịch sử 30 ngày</span>
                <span>Hiện tại</span>
              </div>
              <div className="flex gap-1 h-2.5">
                {last30Days.map((date, i) => {
                  const dateStr = format(date, "yyyy-MM-dd")
                  const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === dateStr)
                  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
                  const isScheduled = habit.frequency === "daily" || (habit.repeat_days?.includes(dayOfWeek))

                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "flex-1 rounded-[1.5px] transition-colors",
                            isCompleted ? "bg-primary" : isScheduled ? "bg-secondary" : "bg-muted/10"
                          )} 
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{format(date, "dd/MM")}: {isCompleted ? "Hoàn thành" : isScheduled ? "Bỏ lỡ" : "Không có lịch"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}