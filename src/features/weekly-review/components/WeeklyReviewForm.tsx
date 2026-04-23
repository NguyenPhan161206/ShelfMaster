"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createWeeklyReview } from "@/features/weekly-review/actions"

export function WeeklyReviewForm({ defaultValues }: { defaultValues?: any }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await createWeeklyReview(formData)
    setLoading(false)
    if (!result?.success) {
      alert(result?.error || "Có lỗi xảy ra")
    } else {
      alert("Đã lưu tổng kết tuần!")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tuần này của bạn thế nào?</CardTitle>
        <CardDescription>Điền form dưới đây để tổng kết tuần hiện tại.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Tóm tắt chung</Label>
            <Textarea id="summary" name="summary" defaultValue={defaultValues?.summary} placeholder="Một tuần khá bận rộn..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievements">Thành tựu đạt được</Label>
            <Textarea id="achievements" name="achievements" defaultValue={defaultValues?.achievements} placeholder="Hoàn thành dự án X, đọc xong sách Y..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="challenges">Khó khăn / Thử thách</Label>
            <Textarea id="challenges" name="challenges" defaultValue={defaultValues?.challenges} placeholder="Chưa dành đủ thời gian tập thể dục..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan_for_next_week">Kế hoạch tuần tới</Label>
            <Textarea id="plan_for_next_week" name="plan_for_next_week" defaultValue={defaultValues?.plan_for_next_week} placeholder="Sẽ dậy sớm hơn 30 phút..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu tổng kết"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}