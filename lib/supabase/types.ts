export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          university: string | null;
          major: string | null;
          payment_status: "pending" | "confirmed" | "rejected" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          university?: string | null;
          major?: string | null;
          payment_status?: "pending" | "confirmed" | "rejected" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          university?: string | null;
          major?: string | null;
          payment_status?: "pending" | "confirmed" | "rejected" | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          qris_proof_url: string | null;
          status: "pending" | "confirmed" | "rejected";
          admin_notes: string | null;
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          qris_proof_url?: string | null;
          status?: "pending" | "confirmed" | "rejected";
          admin_notes?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "confirmed" | "rejected";
          admin_notes?: string | null;
          confirmed_at?: string | null;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type:
            | "ebook_prompt"
            | "ebook_excel"
            | "ebook_pelajaran"
            | "template_ppt";
          link: string;
          is_active: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type:
            | "ebook_prompt"
            | "ebook_excel"
            | "ebook_pelajaran"
            | "template_ppt";
          link: string;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          type?:
            | "ebook_prompt"
            | "ebook_excel"
            | "ebook_pelajaran"
            | "template_ppt";
          link?: string;
          is_active?: boolean;
          order_index?: number;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: {
          value?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          role: string;
        };
        Insert: {
          id: string;
          role?: string;
        };
        Update: {
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

