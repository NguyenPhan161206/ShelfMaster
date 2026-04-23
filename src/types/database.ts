export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          frequency: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          frequency?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          frequency?: string
          created_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
        }
      }
      journals: {
        Row: {
          id: string
          user_id: string
          content: string
          mood: string | null
          energy_level: number | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          mood?: string | null
          energy_level?: number | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          mood?: string | null
          energy_level?: number | null
          tags?: string[] | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string | null
          type: "income" | "expense"
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description?: string | null
          type: "income" | "expense"
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string | null
          type?: "income" | "expense"
          date?: string
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: "todo" | "in_progress" | "completed" | "cancelled"
          progress_percent: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: "todo" | "in_progress" | "completed" | "cancelled"
          progress_percent?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: "todo" | "in_progress" | "completed" | "cancelled"
          progress_percent?: number
          created_at?: string
        }
      }
      weekly_reviews: {
        Row: {
          id: string
          user_id: string
          week_start_date: string
          summary: string | null
          achievements: string | null
          challenges: string | null
          plan_for_next_week: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start_date: string
          summary?: string | null
          achievements?: string | null
          challenges?: string | null
          plan_for_next_week?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start_date?: string
          summary?: string | null
          achievements?: string | null
          challenges?: string | null
          plan_for_next_week?: string | null
          created_at?: string
        }
      }
    }
  }
}