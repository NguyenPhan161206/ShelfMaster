"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, BookHeart, LineChart, Target, Wallet, CalendarRange } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const routes = [
  { name: "Tổng quan", path: "/", icon: LayoutDashboard },
  { name: "Thói quen", path: "/habits", icon: CheckSquare },
  { name: "Nhật ký", path: "/journal", icon: BookHeart },
  { name: "Cảm xúc & Năng lượng", path: "/mood", icon: LineChart },
  { name: "Mục tiêu", path: "/goals", icon: Target },
  { name: "Tài chính", path: "/finance", icon: Wallet },
  { name: "Tổng kết tuần", path: "/weekly-review", icon: CalendarRange },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-20 border-r bg-card min-h-screen p-4 sticky top-0 h-screen transition-all duration-300">
      <div className="flex justify-center mb-10 mt-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Target className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      <nav className="flex flex-col items-center gap-4">
        {routes.map((route) => {
          const isActive = pathname === route.path
          return (
            <Tooltip key={route.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={route.path}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <route.icon className={cn(
                    "w-6 h-6 transition-transform",
                    !isActive && "group-hover:scale-110"
                  )} />
                  
                  {/* Indicator cho trang đang chọn */}
                  {isActive && (
                    <div className="absolute -left-4 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="font-bold">
                {route.name}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* Phần footer sidebar (tuỳ chọn) */}
      <div className="mt-auto flex justify-center pb-4">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </aside>
  )
}