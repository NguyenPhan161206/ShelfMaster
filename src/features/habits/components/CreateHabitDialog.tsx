"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createHabit } from "@/features/habits/actions"
import { Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const daysOfWeek = [
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
  { label: "CN", value: 7 },
]

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [frequency, setFrequency] = useState("daily")
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const toggleDay = (value: number) => {
    setSelectedDays(prev => 
      prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
    )
  }

  async function onSubmit(formData: FormData) {
    setLoading(true)
    
    // Đính kèm danh sách ngày đã chọn vào formData
    if (frequency === "weekly") {
      formData.append("repeat_days", selectedDays.join(","))
    }

    const result = await createHabit(formData)
    setLoading(false)
    if (result?.success) {
      setOpen(false)
      setSelectedDays([])
      setFrequency("daily")
    } else {
      alert(result?.error || "Có lỗi xảy ra")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg"><Plus className="w-4 h-4 mr-2" /> Thêm thói quen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Thêm thói quen mới</DialogTitle>
          <DialogDescription>
            Tạo lập kỷ luật để thay đổi bản thân tốt hơn mỗi ngày.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên thói quen</Label>
              <Input id="title" name="title" placeholder="VD: Tập Gym, Đọc sách..." required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả ngắn</Label>
              <Textarea id="description" name="description" placeholder="Ghi chú thêm về thói quen này..." className="h-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="frequency">Tần suất</Label>
                 <Select name="frequency" value={frequency} onValueChange={setFrequency}>
                   <SelectTrigger>
                     <SelectValue placeholder="Chọn" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="daily">Hàng ngày</SelectItem>
                     <SelectItem value="weekly">Hàng tuần</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               {frequency === "daily" && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                   <Label htmlFor="reminder_time">Giờ nhắc nhở</Label>
                   <Input id="reminder_time" name="reminder_time" type="time" defaultValue="08:00" />
                 </div>
               )}
            </div>

            {frequency === "weekly" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                <Label>Lặp lại vào các thứ</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xs font-bold transition-all border",
                        selectedDays.includes(day.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thói quen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}