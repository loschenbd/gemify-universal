export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_updates: {
        Row: {
          created_at: string
          date: string | null
          devotional: string | null
          id: number
          prayer: string | null
          processed_gems: Json[] | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          devotional?: string | null
          id?: number
          prayer?: string | null
          processed_gems?: Json[] | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          devotional?: string | null
          id?: number
          prayer?: string | null
          processed_gems?: Json[] | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_daily_updates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gems: {
        Row: {
          action_items: string[] | null
          additional_info: string | null
          audio_url: string | null
          author: string | null
          bible_verses: string[] | null
          created_at: string
          duration: number | null
          follow_up: string[] | null
          fulfilled: boolean | null
          id: number
          main_points: string[] | null
          profile_id: string | null
          public: boolean | null
          related_topics: string[] | null
          sharing_token: string | null
          stories: string[] | null
          summary: string | null
          tags: string | null
          title: string | null
          transcript: string[] | null
        }
        Insert: {
          action_items?: string[] | null
          additional_info?: string | null
          audio_url?: string | null
          author?: string | null
          bible_verses?: string[] | null
          created_at?: string
          duration?: number | null
          follow_up?: string[] | null
          fulfilled?: boolean | null
          id?: number
          main_points?: string[] | null
          profile_id?: string | null
          public?: boolean | null
          related_topics?: string[] | null
          sharing_token?: string | null
          stories?: string[] | null
          summary?: string | null
          tags?: string | null
          title?: string | null
          transcript?: string[] | null
        }
        Update: {
          action_items?: string[] | null
          additional_info?: string | null
          audio_url?: string | null
          author?: string | null
          bible_verses?: string[] | null
          created_at?: string
          duration?: number | null
          follow_up?: string[] | null
          fulfilled?: boolean | null
          id?: number
          main_points?: string[] | null
          profile_id?: string | null
          public?: boolean | null
          related_topics?: string[] | null
          sharing_token?: string | null
          stories?: string[] | null
          summary?: string | null
          tags?: string | null
          title?: string | null
          transcript?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "gems_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      installs: {
        Row: {
          expo_tokens: string[] | null
          user_id: string
        }
        Insert: {
          expo_tokens?: string[] | null
          user_id: string
        }
        Update: {
          expo_tokens?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "installs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          id: string
          name: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          id: string
          name?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

