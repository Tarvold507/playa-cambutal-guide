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
      adventure_business_listings: {
        Row: {
          address: string | null
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          business_name: string
          business_type: string
          category: string
          created_at: string | null
          description: string
          hours: string
          id: string
          image_url: string | null
          location: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          whatsapp: string
        }
        Insert: {
          address?: string | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          business_name: string
          business_type: string
          category: string
          created_at?: string | null
          description: string
          hours: string
          id?: string
          image_url?: string | null
          location?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          whatsapp: string
        }
        Update: {
          address?: string | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          business_name?: string
          business_type?: string
          category?: string
          created_at?: string | null
          description?: string
          hours?: string
          id?: string
          image_url?: string | null
          location?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
          subscribed_at: string
          unsubscribe_token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string
          subscribed_at?: string
          unsubscribe_token?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
          subscribed_at?: string
          unsubscribe_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content_data: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          is_visible: boolean
          page_path: string
          section_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_data?: Json
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          page_path: string
          section_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_data?: Json
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean
          page_path?: string
          section_name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          page_title: string
          robots: string | null
          schema_markup: Json | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          page_title: string
          robots?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          page_title?: string
          robots?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
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
          closed_for_season: boolean
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
          closed_for_season?: boolean
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
          closed_for_season?: boolean
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
      [_ in never]: never
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
      content_type:
        | "hero"
        | "text"
        | "image"
        | "card"
        | "featured"
        | "section"
        | "services"
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
      content_type: [
        "hero",
        "text",
        "image",
        "card",
        "featured",
        "section",
        "services",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
