export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      videos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          url: string
          storage_path: string
          duration: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          url: string
          storage_path: string
          duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          url?: string
          storage_path?: string
          duration?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      error_logs: {
        Row: {
          id: string
          user_id: string
          error_type: string
          error_message: string
          error_details: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          error_type: string
          error_message: string
          error_details?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          error_type?: string
          error_message?: string
          error_details?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
    }
  }
} 