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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      content_flags: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          details: string | null
          id: string
          reason: Database["public"]["Enums"]["flag_reason"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["flag_status"]
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          details?: string | null
          id?: string
          reason: Database["public"]["Enums"]["flag_reason"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["flag_status"]
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          details?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["flag_reason"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["flag_status"]
          user_id?: string
        }
        Relationships: []
      }
      moderation_logs: {
        Row: {
          action: Database["public"]["Enums"]["mod_action"]
          admin_id: string
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          id: string
          reason: string
        }
        Insert: {
          action: Database["public"]["Enums"]["mod_action"]
          admin_id: string
          content_id: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          reason: string
        }
        Update: {
          action?: Database["public"]["Enums"]["mod_action"]
          admin_id?: string
          content_id?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          reason?: string
        }
        Relationships: []
      }
      page_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          page_id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          page_id: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          page_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_page_categories_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_page_categories_page_id"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_elements: {
        Row: {
          content: Json
          created_at: string
          element_type: Database["public"]["Enums"]["element_type"]
          id: string
          page_id: string
          position: number
          properties: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          element_type: Database["public"]["Enums"]["element_type"]
          id?: string
          page_id: string
          position: number
          properties: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          element_type?: Database["public"]["Enums"]["element_type"]
          id?: string
          page_id?: string
          position?: number
          properties?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_page_elements_page_id"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          ai_safety_check: boolean
          created_at: string
          id: string
          meta_description: string | null
          profile_id: string
          title: string
          updated_at: string
          user_id: string
          visibility: Database["public"]["Enums"]["page_visibility"]
        }
        Insert: {
          ai_safety_check?: boolean
          created_at?: string
          id?: string
          meta_description?: string | null
          profile_id: string
          title: string
          updated_at?: string
          user_id: string
          visibility?: Database["public"]["Enums"]["page_visibility"]
        }
        Update: {
          ai_safety_check?: boolean
          created_at?: string
          id?: string
          meta_description?: string | null
          profile_id?: string
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["page_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_pages_profile_id"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          beep_design: Json
          buzz_design: Json
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          beep_design?: Json
          buzz_design?: Json
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          beep_design?: Json
          buzz_design?: Json
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      sticker_designs: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          created_at: string
          design_data: Json
          id: string
          profile_id: string | null
          sticker_type: Database["public"]["Enums"]["sticker_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          design_data: Json
          id?: string
          profile_id?: string | null
          sticker_type: Database["public"]["Enums"]["sticker_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          design_data?: Json
          id?: string
          profile_id?: string | null
          sticker_type?: Database["public"]["Enums"]["sticker_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sticker_designs_profile_id"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stickers: {
        Row: {
          created_at: string
          design_id: string | null
          id: string
          page_id: string
          position_x: number
          position_y: number
          sticker_type: Database["public"]["Enums"]["sticker_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          design_id?: string | null
          id?: string
          page_id: string
          position_x: number
          position_y: number
          sticker_type: Database["public"]["Enums"]["sticker_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          design_id?: string | null
          id?: string
          page_id?: string
          position_x?: number
          position_y?: number
          sticker_type?: Database["public"]["Enums"]["sticker_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_stickers_design_id"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "sticker_designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stickers_page_id"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      content_type: "page" | "sticker" | "element"
      element_type: "text" | "shape" | "divider" | "youtube"
      flag_reason: "inappropriate" | "spam" | "offensive" | "other"
      flag_status: "pending" | "reviewed" | "dismissed"
      mod_action: "approve" | "remove" | "warn" | "ban"
      page_visibility: "public" | "private"
      sticker_type: "beep" | "buzz"
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
      approval_status: ["pending", "approved", "rejected"],
      content_type: ["page", "sticker", "element"],
      element_type: ["text", "shape", "divider", "youtube"],
      flag_reason: ["inappropriate", "spam", "offensive", "other"],
      flag_status: ["pending", "reviewed", "dismissed"],
      mod_action: ["approve", "remove", "warn", "ban"],
      page_visibility: ["public", "private"],
      sticker_type: ["beep", "buzz"],
      user_role: ["user", "admin", "super-admin"],
    },
  },
} as const
