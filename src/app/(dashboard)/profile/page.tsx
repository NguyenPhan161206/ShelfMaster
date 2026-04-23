import { getCurrentUser } from "@/features/auth/actions"
import { ProfileForm } from "@/features/auth/components/ProfileForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin của bạn</CardTitle>
          <CardDescription>Cập nhật họ tên và thông tin cơ bản.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Truyền trực tiếp user vì giờ đây user chính là dữ liệu trong bảng public.users */}
          <ProfileForm user={user} profile={user} />
        </CardContent>
      </Card>
    </div>
  )
}