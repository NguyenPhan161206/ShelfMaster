"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { deleteJournal } from "@/features/journal/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

type Journal = {
  id: string
  content: string
  mood: string | null
  energy_level: number | null
  tags: string[] | null
  created_at: string
}

const moodEmoji: Record<string, string> = {
  happy: "😄",
  neutral: "😐",
  sad: "😢",
  stressed: "😫",
  angry: "😠"
}

export function JournalList({ journals }: { journals: Journal[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá nhật ký này?")) {
      startTransition(async () => {
        await deleteJournal(id)
      })
    }
  }

  if (journals.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed">
        <p className="text-muted-foreground">Chưa có nhật ký nào. Hãy bắt đầu viết!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div key={journal.id} className="p-5 rounded-xl border bg-card shadow-sm group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{format(new Date(journal.created_at), "EEEE, d MMMM yyyy HH:mm", { locale: vi })}</span>
              {journal.mood && (
                <span className="bg-secondary px-2 py-0.5 rounded text-foreground flex items-center gap-1">
                  {moodEmoji[journal.mood]}
                </span>
              )}
              {journal.energy_level && (
                <span className="bg-secondary px-2 py-0.5 rounded text-foreground">
                  ⚡ {journal.energy_level}/10
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(journal.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="whitespace-pre-wrap">{journal.content}</p>
          
          {journal.tags && journal.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {journal.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="font-normal">#{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}