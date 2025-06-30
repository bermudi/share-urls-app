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
      bundles: {
        Row: {
          id: string
          user_id: string | null
          vanity_url: string | null
          title: string | null
          description: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          vanity_url?: string | null
          title?: string | null
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          vanity_url?: string | null
          title?: string | null
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bundle_links: {
        Row: {
          id: string
          bundle_id: string
          url: string
          title: string
          description: string
          favicon: string
          og_image: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          bundle_id: string
          url: string
          title?: string
          description?: string
          favicon?: string
          og_image?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          bundle_id?: string
          url?: string
          title?: string
          description?: string
          favicon?: string
          og_image?: string | null
          position?: number
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}