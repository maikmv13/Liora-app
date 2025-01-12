export interface ProfileData {
  email: string;
  created_at: string | null;
  full_name: string;
  id: string;
  license_number: string | null;
  specialization: string | null;
  updated_at: string | null;
  user_id: string;
  user_type: 'user' | 'nutritionist';
} 