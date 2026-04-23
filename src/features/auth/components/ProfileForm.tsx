"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/features/auth/actions"

export function ProfileForm({ user, profile }: { user: any, profile: any }) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateProfile(formData)
    setLoading(false)
    if (result?.success) {
      alert("Cập nhật hồ sơ thành công")
    } else {
      alert(result?.error || "Có lỗi xảy ra")
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email (không thể thay đổi)</Label>
        <Input value={user.email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full_name">Họ và tên</Label>
        <Input id="full_name" name="full_name" defaultValue={profile?.full_name || user.user_metadata?.full_name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website (Tuỳ chọn)</Label>
        <Input id="website" name="website" defaultValue={profile?.website || ""} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
      </Button>
    </form>
  )
}