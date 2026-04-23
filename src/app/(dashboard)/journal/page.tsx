import { createClient } from "@/lib/supabase/server"
import { JournalList } from "@/features/journal/components/JournalList"
import { JournalForm } from "@/features/journal/components/JournalForm"

export default async function JournalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch journals
  const { data: journals } = await supabase
    .from("journals")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nhật ký</h1>
        <p className="text-muted-foreground mt-2">Ghi lại suy nghĩ, cảm xúc và năng lượng của bạn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <JournalForm />
        </div>
        <div className="md:col-span-2">
          <JournalList journals={journals || []} />
        </div>
      </div>
    </div>
  )
}