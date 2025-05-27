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
      business_listings: {
        Row: {
          address: string
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address: string
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_listings_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reminders: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          reminder_sent: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          reminder_sent?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          reminder_sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_date: string
          full_description: string | null
          host: string
          id: string
          image_url: string | null
          location: string
          start_time: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date: string
          full_description?: string | null
          host: string
          id?: string
          image_url?: string | null
          location: string
          start_time?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          full_description?: string | null
          host?: string
          id?: string
          image_url?: string | null
          location?: string
          start_time?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_listings: {
        Row: {
          address: string
          affiliate_url: string
          amenities: Json | null
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          category: string
          commission_rate: number | null
          created_at: string
          currency: string | null
          description: string | null
          expedia_hotel_id: string | null
          full_description: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          policies: Json | null
          price_from: number | null
          rating: number | null
          review_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          affiliate_url: string
          amenities?: Json | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          commission_rate?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expedia_hotel_id?: string | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          policies?: Json | null
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          affiliate_url?: string
          amenities?: Json | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          commission_rate?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expedia_hotel_id?: string | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          policies?: Json | null
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_affiliated: boolean | null
          business_name: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          business_affiliated?: boolean | null
          business_name?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          business_affiliated?: boolean | null
          business_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      restaurant_listings: {
        Row: {
          address: string
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          description: string | null
          email: string | null
          gallery_images: Json | null
          hours: Json | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          menu_images: Json | null
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address: string
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_images?: Json | null
          hours?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          menu_images?: Json | null
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          gallery_images?: Json | null
          hours?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          menu_images?: Json | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_event_reminders: {
        Row: {
          created_at: string
          event_id: string
          id: string
          reminder_sent: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          reminder_sent?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          reminder_sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      event_reminders_view: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          event_date: string | null
          event_id: string | null
          host: string | null
          id: string | null
          location: string | null
          name: string | null
          reminder_sent: boolean | null
          start_time: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
