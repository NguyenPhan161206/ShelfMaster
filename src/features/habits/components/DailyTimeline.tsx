"use client"

import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { useTransition } from "react"
import { toggleHabitLog } from "@/features/habits/actions"

type Habit = {
  id: string
  title: string
  reminder_time: string | null
  frequency: string
  repeat_days: number[] | null
}

type HabitLog = {
  habit_id: string
  completed_at: string
}

export function DailyTimeline({ habits, logs }: { habits: Habit[], logs: HabitLog[] }) {
  const [isPending, startTransition] = useTransition()
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const dayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay()

  // Lọc habits cần làm trong hôm nay
  const todayHabits = habits.filter(h => 
    h.frequency === "daily" || (h.repeat_days?.includes(dayOfWeek))
  )

  const handleToggle = (habitId: string, isCompleted: boolean) => {
    startTransition(async () => {
      await toggleHabitLog(habitId, todayStr, !isCompleted)
    })
  }

  // Tạo mảng 24 giờ
  const hours = Array.from({ length: 24 }).map((_, i) => i)

  return (
    <div className="relative border rounded-2xl bg-card overflow-hidden h-[600px] flex flex-col shadow-sm">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <h3 className="font-bold">Lịch trình hôm nay</h3>
        <span className="text-xs text-muted-foreground uppercase font-black tracking-widest bg-background px-2 py-1 rounded border">
          {format(new Date(), "EEEE, dd/MM", { locale: vi })}
        </span>
      </div>
      
      {/* Thay thế ScrollArea bằng div overflow-y-auto truyền thống để đảm bảo hoạt động tốt nhất */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        <div className="relative">
          {/* Trục thời gian */}
          {hours.map((hour) => {
            const hourStr = hour.toString().padStart(2, '0') + ":00"
            const habitsAtHour = todayHabits.filter(h => h.reminder_time?.startsWith(hour.toString().padStart(2, '0')))
            
            return (
              <div key={hour} className="flex gap-4 min-h-[70px] group">
                <div className="w-12 text-right pt-2">
                  <span className="text-[11px] font-black text-muted-foreground/40 tabular-nums">
                    {hourStr}
                  </span>
                </div>
                
                <div className="relative flex-1 border-l-2 border-dashed border-muted/50 pl-6 pb-6">
                  {/* Đường kẻ ngang mờ */}
                  <div className="absolute top-4 left-0 w-full h-[1px] bg-muted/30 group-hover:bg-muted/50 transition-colors" />
                  
                  <div className="space-y-3 relative z-10">
                    {habitsAtHour.length > 0 ? (
                      habitsAtHour.map(habit => {
                        const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === todayStr)
                        return (
                          <button
                            key={habit.id}
                            onClick={() => handleToggle(habit.id, isCompleted)}
                            disabled={isPending}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left group/item shadow-sm",
                              isCompleted 
                                ? "bg-primary/5 border-primary/20 text-primary" 
                                : "bg-card border-muted hover:border-primary/40 hover:shadow-md"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                isCompleted 
                                  ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" 
                                  : "bg-secondary text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary"
                              )}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                              </div>
                              <div>
                                <p className={cn(
                                  "font-black text-sm md:text-base leading-tight tracking-tight",
                                  isCompleted && "line-through opacity-70"
                                )}>
                                  {habit.title}
                                </p>
                                <p className="text-[11px] font-bold opacity-60 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                                  <Clock className="w-3.5 h-3.5" /> {habit.reminder_time}
                                </p>
                              </div>
                            </div>
                            {isCompleted && (
                              <div className="bg-primary/20 px-2 py-1 rounded-md">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Hoàn thành</span>
                              </div>
                            )}
                          </button>
                        )
                      })
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Những thói quen không có giờ cụ thể */}
          {todayHabits.some(h => !h.reminder_time) && (
            <div className="mt-12 pt-8 border-t-4 border-double border-muted">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h4 className="text-xs font-black uppercase text-foreground tracking-[0.2em]">Cả ngày / Chưa đặt giờ</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                 {todayHabits.filter(h => !h.reminder_time).map(habit => {
                   const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_at === todayStr)
                   return (
                     <button
                       key={habit.id}
                       onClick={() => handleToggle(habit.id, isCompleted)}
                       disabled={isPending}
                       className={cn(
                         "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left shadow-sm",
                         isCompleted 
                          ? "bg-primary/5 border-primary/10 opacity-70" 
                          : "bg-card border-muted hover:border-primary/30 hover:shadow-md"
                       )}
                     >
                       <div className={cn(
                         "p-2 rounded-xl",
                         isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                       )}>
                         {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                       </div>
                       <span className={cn("font-bold text-sm tracking-tight", isCompleted && "line-through opacity-60 text-muted-foreground")}>
                         {habit.title}
                       </span>
                     </button>
                   )
                 })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}