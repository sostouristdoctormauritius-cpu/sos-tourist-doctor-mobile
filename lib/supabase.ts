import { createClient } from '@supabase/supabase-js';
import { Doctor } from '@/types/auth';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          specialization: string;
          profile_photo?: string;
          phone?: string;
          bio?: string;
          verified: boolean;
          created_at: string;
          updated_at?: string;
          languages?: string[];
          availability_status: 'available' | 'busy' | 'offline';
          license_number?: string;
          years_of_experience?: number;
          role: 'doctor' | 'admin';
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          specialization: string;
          profile_photo?: string;
          phone?: string;
          bio?: string;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          languages?: string[];
          availability_status?: 'available' | 'busy' | 'offline';
          license_number?: string;
          years_of_experience?: number;
          role?: 'doctor' | 'admin';
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          specialization?: string;
          profile_photo?: string;
          phone?: string;
          bio?: string;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          languages?: string[];
          availability_status?: 'available' | 'busy' | 'offline';
          license_number?: string;
          years_of_experience?: number;
          role?: 'doctor' | 'admin';
        };
      };
    };
  };
}

// Auth helpers
export const authHelpers = {
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const dbHelpers = {
  async getDoctorById(id: string): Promise<{ data: Doctor | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching doctor:', error);
        return { data: null, error };
      }

      if (!data) {
        return { data: null, error: null };
      }

      // Transform database row to Doctor interface
      const doctor: Doctor = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        specialization: data.specialization,
        profilePhoto: data.profile_photo,
        phone: data.phone,
        bio: data.bio,
        verified: data.verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        languages: data.languages,
        availabilityStatus: data.availability_status,
        licenseNumber: data.license_number,
        yearsOfExperience: data.years_of_experience,
      };

      return { data: doctor, error: null };
    } catch (error) {
      console.error('Error in getDoctorById:', error);
      return { data: null, error };
    }
  },

  async getDoctorByEmail(email: string): Promise<{ data: Doctor | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching doctor by email:', error);
        return { data: null, error };
      }

      if (!data) {
        return { data: null, error: null };
      }

      // Transform database row to Doctor interface
      const doctor: Doctor = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        specialization: data.specialization,
        profilePhoto: data.profile_photo,
        phone: data.phone,
        bio: data.bio,
        verified: data.verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        languages: data.languages,
        availabilityStatus: data.availability_status,
        licenseNumber: data.license_number,
        yearsOfExperience: data.years_of_experience,
      };

      return { data: doctor, error: null };
    } catch (error) {
      console.error('Error in getDoctorByEmail:', error);
      return { data: null, error };
    }
  },

  async createDoctor(doctorData: Database['public']['Tables']['doctors']['Insert']): Promise<{ data: Doctor | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert(doctorData)
        .select()
        .single();

      if (error) {
        console.error('Error creating doctor:', error);
        return { data: null, error };
      }

      // Transform database row to Doctor interface
      const doctor: Doctor = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        specialization: data.specialization,
        profilePhoto: data.profile_photo,
        phone: data.phone,
        bio: data.bio,
        verified: data.verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        languages: data.languages,
        availabilityStatus: data.availability_status,
        licenseNumber: data.license_number,
        yearsOfExperience: data.years_of_experience,
      };

      return { data: doctor, error: null };
    } catch (error) {
      console.error('Error in createDoctor:', error);
      return { data: null, error };
    }
  },
};