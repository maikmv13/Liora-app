import type { Database } from './supabase';

type DbProfile = Database['public']['Tables']['profiles']['Row'];

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: string;
  created_at: string;
  updated_at: string;
} 