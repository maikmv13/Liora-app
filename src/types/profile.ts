import type { Database } from './supabase';

type DbProfile = Database['public']['Tables']['profiles']['Row'];

export interface Profile extends DbProfile {
  // Si necesitamos extender con propiedades adicionales
} 