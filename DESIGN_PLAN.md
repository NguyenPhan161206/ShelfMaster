# Kế hoạch Thiết kế và Triển khai: SelfMaster

## 1. Mục tiêu (Goal) & Phong cách thiết kế (Aesthetic)
- **Mục tiêu**: Xây dựng một ứng dụng web quản lý cá nhân đa năng (SelfMaster) hỗ trợ nhiều người dùng với tính bảo mật dữ liệu tuyệt đối (qua Supabase RLS).
- **Aesthetic**:
  - Tối giản (Minimalist), sử dụng nhiều khoảng trắng (Whitespace).
  - Dark Mode mặc định. Màu nền đậm (slate-950 hoặc neutral-950) kết hợp với màu accent nhẹ nhàng như Teal hoặc Indigo.
  - Sử dụng các hình khối góc bo tròn (rounded-xl, rounded-2xl), bóng đổ nhẹ để tạo chiều sâu.
  - Cảm giác "Alive" thông qua tương tác UI: Hover effects, skeleton loading, optimistic UI updates.
  - Hỗ trợ ngôn ngữ tiếng Việt hoàn toàn (Định dạng ngày tháng, thông báo, UI text).

## 2. Stack Công Nghệ (Tech Stack)
- **Framework**: Next.js 15 (App Router).
- **Ngôn ngữ**: TypeScript (Strict).
- **Styling**: Tailwind CSS.
- **UI Components**: Shadcn UI & Radix UI.
- **Biểu đồ**: Recharts.
- **Icons**: Lucide React.
- **Quản lý thời gian**: `date-fns` với locale `vi`.
- **Backend & Auth**: Supabase (@supabase/ssr).

## 3. Cấu trúc Thư mục (Feature-First)
Dự án sẽ tuân thủ cấu trúc sau:
```
src/
├── app/
│   ├── (auth)/                # login, register, forgot-password
│   ├── (dashboard)/           # layout chính, trang chủ, các features
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Các component từ Shadcn UI
│   └── shared/                # Các component dùng chung (Header, Sidebar)
├── features/
│   ├── auth/                  # Logic, components cho Auth & Profile
│   ├── dashboard/             # Widget tổng quan
│   ├── habits/                # Quản lý Habits & Habit Logs (Calendar, Heatmap)
│   ├── journal/               # Viết Journal
│   ├── mood/                  # Biểu đồ Mood & Energy
│   ├── goals/                 # Mục tiêu, Progress Bar
│   ├── finance/               # Thu/Chi, Biểu đồ thống kê
│   └── weekly-review/         # Tổng kết tuần
├── lib/
│   ├── supabase/              # Client/Server configs cho Supabase
│   └── utils.ts               # Utilities cho Tailwind và common logic
└── types/                     # Định nghĩa Database Schema & Global types
```

## 4. Database (Supabase)
Sẽ tận dụng Database Schema được cung cấp (`supabase_schema.sql`).
- Sử dụng Supabase CLI (hoặc type generator) để tự động sinh file type `database.types.ts`.
- Bảo đảm `profiles`, `habits`, `habit_logs`, `journals`, `transactions`, `goals`, `weekly_reviews` đều có RLS để người dùng chỉ thấy dữ liệu của họ.

## 5. Lộ trình Thực thi (Execution Plan)

### Giai đoạn 1: Thiết lập dự án & Nền tảng UI
- Chạy `create-next-app` (nếu chưa có).
- Cài đặt Tailwind CSS, Shadcn UI, Recharts, Date-fns.
- Thiết lập Supabase Client (ssr).
- Tạo layout mặc định (Dark mode) và `globals.css`.

### Giai đoạn 2: Authentication & Profile
- Triển khai trang đăng nhập/đăng ký.
- Thiết lập middleware `supabase/ssr` bảo vệ route `(dashboard)`.
- Tạo form chỉnh sửa Profile.

### Giai đoạn 3: Core Layout
- Tạo `Sidebar` responsive (Drawer trên Mobile).
- Tạo `Header` với User Avatar.

### Giai đoạn 4: Tính năng Habit Tracker (Ưu tiên Cao)
- Xây dựng DB types.
- Tạo danh sách Habit.
- Triển khai cơ chế Log (Check/Uncheck) và tính Streak.
- Xây dựng Heatmap (sử dụng grid cơ bản hoặc thư viện nhẹ).

### Giai đoạn 5: Dashboard Bảng điều khiển Daily
- Tích hợp Habit List.
- Tích hợp Mood/Energy quick input.
- Tích hợp Overview tài chính, tiến độ.

### Giai đoạn 6: Journal & Mood/Energy Tracker
- Form Journal (Mood emoji selector, Energy slider).
- Render biểu đồ bằng Recharts hiển thị lịch sử Mood.

### Giai đoạn 7: Goals & Finance
- CRUD Mục tiêu với status Todo/In progress/Done.
- CRUD Transactions và hiển thị thu/chi theo tháng với biểu đồ cột.

### Giai đoạn 8: Weekly Review
- Form kết tuần lưu lại achievements, challenges.

## 6. Tiêu chuẩn Mã nguồn
- Các thao tác mutate dữ liệu (CRUD) sẽ dùng **Server Actions** Next.js 15.
- Các trang sẽ là **Server Components** (`async function Page()`) kết nối trực tiếp với Supabase server client.
- Khi cần tính tương tác (như Form, Modal), chuyển xuống **Client Components** (`"use client"`).
- Comment tiếng Việt ở các block phức tạp. Không sử dụng `any`.

---
Nếu bạn đồng ý với kế hoạch chi tiết này, hãy cấp quyền để tôi thoát khỏi "Plan Mode" và bắt đầu tạo dự án Next.js 15 nhé!