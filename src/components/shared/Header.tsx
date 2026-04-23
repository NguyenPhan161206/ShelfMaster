"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, UserCircle, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, BookHeart, LineChart, Target, Wallet, CalendarRange } from "lucide-react"

const routes = [
  { name: "Tổng quan", path: "/", icon: LayoutDashboard },
  { name: "Thói quen", path: "/habits", icon: CheckSquare },
  { name: "Nhật ký", path: "/journal", icon: BookHeart },
  { name: "Cảm xúc & Năng lượng", path: "/mood", icon: LineChart },
  { name: "Mục tiêu", path: "/goals", icon: Target },
  { name: "Tài chính", path: "/finance", icon: Wallet },
  { name: "Tổng kết tuần", path: "/weekly-review", icon: CalendarRange },
]

export function Header({ user }: { user: any }) {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
               <SheetTitle className="text-left font-bold text-xl text-primary mb-4 flex items-center gap-2">
                 <Target className="w-6 h-6" /> SelfMaster
               </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-4">
              {routes.map((route) => {
                const Icon = route.icon
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg",
                      pathname === route.path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {route.name}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="font-bold text-xl lg:hidden text-primary flex items-center gap-2">
          <Target className="w-6 h-6" /> SelfMaster
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || "User"} />
                <AvatarFallback><UserCircle className="w-5 h-5" /></AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Người dùng"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full">Hồ sơ cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 cursor-pointer" onSelect={() => {
              const form = document.createElement('form')
              form.action = '/api/auth/logout'
              form.method = 'POST'
              document.body.appendChild(form)
              form.submit()
            }}>
              <LogOut className="mr-2 w-4 h-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}