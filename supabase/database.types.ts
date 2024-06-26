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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

