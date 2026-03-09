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
          auth_user_id: string | null;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          referral_code: string;
          portal_enabled: boolean;
          must_reset_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      policies: {
        Row: {
          id: string;
          profile_id: string | null;
          source_record_id: string | null;
          policy_number: string;
          status: string;
          product_type: string | null;
          product: string | null;
          start_date: string | null;
          expiration_date: string | null;
          coverage_effective_date: string | null;
          policy_sort_date: string | null;
          street: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          full_address: string | null;
          home_phone: string | null;
          cell: string | null;
          raw_import_json: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["policies"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["policies"]["Insert"]>;
      };
      referrals: {
        Row: {
          id: string;
          referrer_profile_id: string;
          referee_email: string;
          referee_profile_id: string | null;
          referral_code: string;
          status: string;
          reward_amount: number;
          created_at: string;
          enrolled_at: string | null;
          rewarded_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["referrals"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["referrals"]["Insert"]>;
      };
      import_review_flags: {
        Row: {
          id: string;
          source_row_identifier: string | null;
          issue_type: string;
          notes: string | null;
          raw_row_json: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["import_review_flags"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["import_review_flags"]["Insert"]>;
      };
    };
  };
}
