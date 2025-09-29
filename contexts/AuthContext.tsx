import createContextHook from '@nkzw/create-context-hook';
import { Doctor } from '@/types/auth';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { authHelpers, dbHelpers } from '../lib/supabase';
import { useStorage } from './StorageContext';

const DOCTOR_STORAGE_KEY = 'doctor_profile';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storage = useStorage();

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { session, error } = await authHelpers.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.email);
          
          // Try to get doctor profile from storage first (for faster loading)
          try {
            const storedDoctor = await storage.getItem(DOCTOR_STORAGE_KEY);
            if (storedDoctor) {
              const doctorData = JSON.parse(storedDoctor);
              setDoctor(doctorData);
              setIsAuthenticated(true);
            }
          } catch (storageError) {
            console.log('No stored doctor profile found');
          }

          // Fetch fresh doctor data from database
          const { data: doctorData, error: doctorError } = await dbHelpers.getDoctorByEmail(session.user.email!);
          
          if (doctorError) {
            console.error('Error fetching doctor profile:', doctorError);
            // If we have stored data, keep using it
            if (!doctor) {
              await authHelpers.signOut();
              setIsAuthenticated(false);
            }
          } else if (doctorData) {
            setDoctor(doctorData);
            setIsAuthenticated(true);
            // Update stored profile
            await storage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(doctorData));
          } else {
            console.log('No doctor profile found for user:', session.user.email);
            await authHelpers.signOut();
            setIsAuthenticated(false);
          }
        } else {
          console.log('No existing session found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authHelpers.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch doctor profile
        const { data: doctorData, error } = await dbHelpers.getDoctorByEmail(session.user.email!);
        
        if (error) {
          console.error('Error fetching doctor profile on sign in:', error);
          setIsAuthenticated(false);
          setDoctor(null);
        } else if (doctorData) {
          setDoctor(doctorData);
          setIsAuthenticated(true);
          await storage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(doctorData));
        } else {
          console.log('No doctor profile found for signed in user');
          await authHelpers.signOut();
          setIsAuthenticated(false);
          setDoctor(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setDoctor(null);
        setIsAuthenticated(false);
        await storage.removeItem(DOCTOR_STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [storage]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email?.trim() || !password?.trim()) {
      return { success: false, error: 'Email and password are required' };
    }
    
    setIsLoading(true);
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await authHelpers.signInWithPassword(email.trim(), password);
      
      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return { 
          success: false, 
          error: error.message || 'Invalid credentials' 
        };
      }

      if (!data.session?.user) {
        setIsLoading(false);
        return { success: false, error: 'Login failed - no session created' };
      }

      // Fetch doctor profile
      const { data: doctorData, error: doctorError } = await dbHelpers.getDoctorByEmail(data.session.user.email!);
      
      if (doctorError) {
        console.error('Error fetching doctor profile:', doctorError);
        await authHelpers.signOut();
        setIsLoading(false);
        return { 
          success: false, 
          error: 'Account not found. Only doctors and admins can access this app.' 
        };
      }

      if (!doctorData) {
        console.log('No doctor profile found for user:', data.session.user.email);
        await authHelpers.signOut();
        setIsLoading(false);
        return { 
          success: false, 
          error: 'Account not found. Only doctors and admins can access this app.' 
        };
      }

      // Success - auth state will be updated by the listener
      setIsLoading(false);
      return { success: true };
      
    } catch (error: any) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authHelpers.signOut();
      await storage.removeItem(DOCTOR_STORAGE_KEY);
      setDoctor(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  const refreshProfile = useCallback(async () => {
    if (!doctor?.email) return;
    
    try {
      const { data: doctorData, error } = await dbHelpers.getDoctorByEmail(doctor.email);
      
      if (!error && doctorData) {
        setDoctor(doctorData);
        await storage.setItem(DOCTOR_STORAGE_KEY, JSON.stringify(doctorData));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [doctor?.email, storage]);

  return useMemo(() => ({
    doctor,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
    isLoading,
  }), [doctor, isAuthenticated, login, logout, refreshProfile, isLoading]);
});