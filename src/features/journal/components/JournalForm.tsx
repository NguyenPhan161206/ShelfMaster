"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createJournal } from "@/features/journal/actions"

export function JournalForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await createJournal(formData)
    setLoading(false)
    if (result?.success) {
      // Form reset logic can be handled via standard form reset if we bind a ref
      const form = document.getElementById("journal-form") as HTMLFormElement
      if (form) form.reset()
    } else {
      alert(result?.error || "Có lỗi xảy ra")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viết nhật ký</CardTitle>
        <CardDescription>Bạn đang nghĩ gì vậy?</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="journal-form" action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" name="content" placeholder="Hôm nay tôi cảm thấy..." className="min-h-[150px]" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Tâm trạng</Label>
              <Select name="mood" defaultValue="neutral">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">😄 Vui vẻ</SelectItem>
                  <SelectItem value="neutral">😐 Bình thường</SelectItem>
                  <SelectItem value="sad">😢 Buồn</SelectItem>
                  <SelectItem value="stressed">😫 Căng thẳng</SelectItem>
                  <SelectItem value="angry">😠 Tức giận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energy_level">Năng lượng (1-10)</Label>
              <Input id="energy_level" name="energy_level" type="number" min="1" max="10" defaultValue="7" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Thẻ (ngăn cách bằng dấu phẩy)</Label>
            <Input id="tags" name="tags" placeholder="công việc, gia đình..." />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu nhật ký"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}