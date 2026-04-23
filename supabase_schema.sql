-- ==========================================
-- SELFMASTER CUSTOM DATABASE (NO SUPABASE AUTH)
-- ==========================================

-- 1. Bảng Users (Tự quản lý)
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null, -- Lưu hash bcrypt
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 2. Bảng Habits
create table if not exists public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  frequency text default 'daily',
  created_at timestamp with time zone default now()
);

-- 3. Bảng Habit Logs
create table if not exists public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  completed_at date default current_date not null,
  unique(habit_id, completed_at)
);

-- 4. Bảng Journals
create table if not exists public.journals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  mood text,
  energy_level integer check (energy_level >= 1 and energy_level <= 10),
  tags text[],
  created_at timestamp with time zone default now()
);

-- 5. Bảng Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  amount decimal(15, 2) not null,
  category text not null,
  description text,
  type text check (type in ('income', 'expense')) not null,
  date date default current_date not null,
  created_at timestamp with time zone default now()
);

-- 6. Bảng Goals
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  target_date date,
  status text check (status in ('todo', 'in_progress', 'completed', 'cancelled')) default 'todo' not null,
  progress_percent integer default 0 check (progress_percent >= 0 and progress_percent <= 100),
  created_at timestamp with time zone default now()
);

-- 7. Bảng Weekly Reviews
create table if not exists public.weekly_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  week_start_date date not null,
  summary text,
  achievements text,
  challenges text,
  plan_for_next_week text,
  created_at timestamp with time zone default now(),
  unique(user_id, week_start_date)
);

-- VÌ KHÔNG DÙNG SUPABASE AUTH, TẮT RLS ĐỂ QUẢN LÝ QUA APP
alter table public.users disable row level security;
alter table public.habits disable row level security;
alter table public.habit_logs disable row level security;
alter table public.journals disable row level security;
alter table public.transactions disable row level security;
alter table public.goals disable row level security;
alter table public.weekly_reviews disable row level security;
