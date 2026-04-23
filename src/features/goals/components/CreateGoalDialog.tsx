"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createGoal } from "@/features/goals/actions"
import { Target } from "lucide-react"

export function CreateGoalDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await createGoal(formData)
    setLoading(false)
    if (result?.success) {
      setOpen(false)
    } else {
      alert(result?.error || "Có lỗi xảy ra")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Target className="w-4 h-4 mr-2" /> Thêm mục tiêu</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm mục tiêu mới</DialogTitle>
          <DialogDescription>
            Xác định một mục tiêu rõ ràng và thời hạn đạt được nó.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên mục tiêu</Label>
              <Input id="title" name="title" placeholder="VD: Tiết kiệm 50 triệu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea id="description" name="description" placeholder="Kế hoạch thực hiện..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_date">Hạn hoàn thành</Label>
              <Input id="target_date" name="target_date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu mục tiêu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}