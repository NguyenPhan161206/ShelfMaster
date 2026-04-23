import { createClient } from "@/lib/supabase/server"
import { WeeklyReviewForm } from "@/features/weekly-review/components/WeeklyReviewForm"
import { format, startOfWeek, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function WeeklyReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("weekly_reviews")
    .select("*")
    .order("week_start_date", { ascending: false })

  const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  const currentReview = reviews?.find(r => r.week_start_date === currentWeekStart)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng kết tuần</h1>
        <p className="text-muted-foreground mt-2">Nhìn lại một tuần đã qua để cải thiện bản thân tốt hơn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <WeeklyReviewForm defaultValues={currentReview} />
        </div>
        <div className="md:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg">Lịch sử tổng kết</h2>
          {reviews?.filter(r => r.week_start_date !== currentWeekStart).length === 0 ? (
             <div className="text-muted-foreground text-sm py-4">Chưa có lịch sử.</div>
          ) : (
            reviews?.filter(r => r.week_start_date !== currentWeekStart).map(review => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Tuần bắt đầu từ {format(parseISO(review.week_start_date), "dd/MM/yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  {review.summary && <p><strong className="text-foreground">Tóm tắt:</strong> {review.summary}</p>}
                  {review.achievements && <p><strong className="text-foreground">Thành tựu:</strong> {review.achievements}</p>}
                  {review.challenges && <p><strong className="text-foreground">Thử thách:</strong> {review.challenges}</p>}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}