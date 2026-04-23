"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type HabitLog = {
  habit_id: string
  completed_at: string
}

export function MonthlyCalendar({ logs, totalHabitsCount }: { logs: HabitLog[], totalHabitsCount: number }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <div className="border rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
          <div key={day} className="text-center text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">
            {day}
          </div>
        ))}

        {calendarDays.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd")
          const dayLogs = logs.filter(l => l.completed_at === dateStr)
          const completionRate = totalHabitsCount > 0 ? (dayLogs.length / totalHabitsCount) : 0
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, monthStart)

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "relative h-14 md:h-20 border rounded-xl p-2 transition-all group",
                    !isCurrentMonth && "opacity-20 pointer-events-none grayscale",
                    isToday ? "border-primary ring-1 ring-primary" : "border-muted/50 hover:border-primary/30"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isToday && "text-primary"
                  )}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Chấm tròn hoặc vạch tiến độ cho habits */}
                  {isCurrentMonth && dayLogs.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-0.5">
                       {dayLogs.map((_, idx) => (
                         <div key={idx} className="w-1.5 h-1.5 rounded-full bg-primary" />
                       ))}
                    </div>
                  )}

                  {/* Nền màu mờ theo tỷ lệ hoàn thành */}
                  {isCurrentMonth && completionRate > 0 && (
                    <div 
                      className="absolute inset-0 bg-primary/5 rounded-xl -z-10" 
                      style={{ opacity: completionRate }}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{format(day, "dd/MM/yyyy")}</p>
                <p className="text-xs">Hoàn thành: {dayLogs.length} / {totalHabitsCount} thói quen</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}