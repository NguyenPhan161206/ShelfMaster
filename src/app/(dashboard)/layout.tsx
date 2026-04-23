import { ReactNode } from "react"
import { Sidebar } from "@/components/shared/Sidebar"
import { Header } from "@/components/shared/Header"
import { getCurrentUser } from "@/features/auth/actions"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <Header user={user} />
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}