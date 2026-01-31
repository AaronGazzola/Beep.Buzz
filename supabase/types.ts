export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_image_url: string | null
          created_at: string
          criteria: Json
          description: string
          id: string
          reward_xp: number
          title: string
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string
          criteria: Json
          description: string
          id?: string
          reward_xp?: number
          title: string
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string
          criteria?: Json
          description?: string
          id?: string
          reward_xp?: number
          title?: string
        }
        Relationships: []
      }
      competitive_matches: {
        Row: {
          challenge_text: string
          chat_enabled: boolean
          completed_at: string | null
          created_at: string
          id: string
          player1_id: string
          player2_id: string
          status: Database["public"]["Enums"]["match_status"]
          winner_id: string | null
        }
        Insert: {
          challenge_text: string
          chat_enabled?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          player1_id: string
          player2_id: string
          status?: Database["public"]["Enums"]["match_status"]
          winner_id?: string | null
        }
        Update: {
          challenge_text?: string
          chat_enabled?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          player1_id?: string
          player2_id?: string
          status?: Database["public"]["Enums"]["match_status"]
          winner_id?: string | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          category: Database["public"]["Enums"]["leaderboard_category"]
          created_at: string
          id: string
          period_end: string
          period_start: string
          score: number
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["leaderboard_category"]
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          score: number
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["leaderboard_category"]
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          accuracy: number | null
          attempts: number
          completed: boolean
          created_at: string
          id: string
          last_attempt: string | null
          lesson_id: string
          updated_at: string
          user_id: string
          wpm: number | null
        }
        Insert: {
          accuracy?: number | null
          attempts?: number
          completed?: boolean
          created_at?: string
          id?: string
          last_attempt?: string | null
          lesson_id: string
          updated_at: string
          user_id: string
          wpm?: number | null
        }
        Update: {
          accuracy?: number | null
          attempts?: number
          completed?: boolean
          created_at?: string
          id?: string
          last_attempt?: string | null
          lesson_id?: string
          updated_at?: string
          user_id?: string
          wpm?: number | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          character_set: string[]
          completion_criteria: Json
          created_at: string
          description: string | null
          difficulty: number
          id: string
          order_index: number
          prerequisites: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          character_set: string[]
          completion_criteria: Json
          created_at?: string
          description?: string | null
          difficulty: number
          id?: string
          order_index: number
          prerequisites?: string[] | null
          title: string
          updated_at: string
        }
        Update: {
          character_set?: string[]
          completion_criteria?: Json
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          order_index?: number
          prerequisites?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      match_solutions: {
        Row: {
          accuracy: number
          completed_at: string | null
          created_at: string
          id: string
          match_id: string
          submission: string
          user_id: string
          wpm: number
        }
        Insert: {
          accuracy: number
          completed_at?: string | null
          created_at?: string
          id?: string
          match_id: string
          submission: string
          user_id: string
          wpm: number
        }
        Update: {
          accuracy?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          match_id?: string
          submission?: string
          user_id?: string
          wpm?: number
        }
        Relationships: []
      }
      morse_messages: {
        Row: {
          created_at: string
          decoded_at: string | null
          decoded_content: string | null
          encoded_content: string
          id: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          decoded_at?: string | null
          decoded_content?: string | null
          encoded_content: string
          id?: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          decoded_at?: string | null
          decoded_content?: string | null
          encoded_content?: string
          id?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          accuracy: number
          character_set: string[]
          created_at: string
          difficulty: number
          duration_seconds: number
          id: string
          mistakes: number
          user_id: string
          wpm: number
        }
        Insert: {
          accuracy: number
          character_set: string[]
          created_at?: string
          difficulty: number
          duration_seconds: number
          id?: string
          mistakes?: number
          user_id: string
          wpm: number
        }
        Update: {
          accuracy?: number
          character_set?: string[]
          created_at?: string
          difficulty?: number
          duration_seconds?: number
          id?: string
          mistakes?: number
          user_id?: string
          wpm?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_practice: string | null
          rank: number
          role: Database["public"]["Enums"]["user_role"]
          settings: Json | null
          streak_days: number
          updated_at: string
          user_id: string
          username: string
          xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_practice?: string | null
          rank?: number
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          streak_days?: number
          updated_at: string
          user_id: string
          username: string
          xp?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_practice?: string | null
          rank?: number
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          streak_days?: number
          updated_at?: string
          user_id?: string
          username?: string
          xp?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          progress: Json
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          progress?: Json
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          progress?: Json
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          avg_decode_wpm: number
          avg_encode_wpm: number
          created_at: string
          id: string
          matches_played: number
          matches_won: number
          total_practice_time: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_decode_wpm?: number
          avg_encode_wpm?: number
          created_at?: string
          id?: string
          matches_played?: number
          matches_won?: number
          total_practice_time?: number
          updated_at: string
          user_id: string
        }
        Update: {
          avg_decode_wpm?: number
          avg_encode_wpm?: number
          created_at?: string
          id?: string
          matches_played?: number
          matches_won?: number
          total_practice_time?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      leaderboard_category:
        | "encoding_speed"
        | "decoding_speed"
        | "overall"
        | "weekly_challenge"
      match_status: "in_progress" | "completed" | "abandoned"
      user_role: "user" | "admin" | "super-admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      leaderboard_category: [
        "encoding_speed",
        "decoding_speed",
        "overall",
        "weekly_challenge",
      ],
      match_status: ["in_progress", "completed", "abandoned"],
      user_role: ["user", "admin", "super-admin"],
    },
  },
} as const
