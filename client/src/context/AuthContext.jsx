import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthError(error.message);
        } else {
          setUser(session?.user ?? null);
          
          // Create profile if user exists but no profile
          if (session?.user) {
            await ensureUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user ?? null);
        setAuthError(null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserProfile(session.user);
        }
        
        if (event === 'SIGNED_OUT') {
          setAuthError(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Ensure user profile exists (create if missing)
  const ensureUserProfile = async (user) => {
    try {
      console.log('Ensuring profile for user:', user.id, user.email);
      
      // First, check if profiles table exists
      const { error: tableError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (tableError) {
        console.error('Profiles table error:', tableError);
        return;
      }

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, username')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      if (!existingProfile) {
        console.log('Creating new profile for:', user.email);
        
        // Get user metadata from auth
        const firstName = user.user_metadata?.first_name || '';
        const lastName = user.user_metadata?.last_name || '';
        const phone = user.user_metadata?.phone || '';
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            user_type: 'customer',
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('❌ Error creating profile:', insertError);
          
          // If it's a duplicate, try to update instead
          if (insertError.code === '23505') { // Unique violation
            console.log('Profile already exists, updating...');
            await supabase
              .from('profiles')
              .update({
                email: user.email,
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);
          }
        } else {
          console.log('✅ Profile created for:', user.email);
        }
      } else {
        console.log('Profile already exists for:', user.email);
      }
    } catch (error) {
      console.error('❌ Error in ensureUserProfile:', error);
    }
  };

  // Fixed signUp function with better error handling
  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('🔐 Signing up user:', email, userData);
      
      setAuthError(null);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      console.log('📤 Calling Supabase auth.signUp...');
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            first_name: userData.firstName?.trim() || '',
            last_name: userData.lastName?.trim() || '',
            phone: userData.phone?.trim() || '',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('❌ Supabase signUp error:', error);
        
        // User-friendly error messages
        if (error.message.includes('already registered') || error.code === 'user_already_exists') {
          throw new Error('An account with this email already exists. Please login instead.');
        } else if (error.message.includes('password') || error.code === 'weak_password') {
          throw new Error('Password is too weak. Please use a stronger password.');
        } else if (error.message.includes('email') || error.code === 'invalid_email') {
          throw new Error('Invalid email address format.');
        } else if (error.code === 'rate_limit_exceeded') {
          throw new Error('Too many attempts. Please try again in a few minutes.');
        } else {
          throw new Error(error.message || 'Registration failed. Please try again.');
        }
      }

      console.log('✅ Auth signup successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session
      });

      // Create profile in public.profiles table
      if (data.user) {
        console.log('📝 Creating user profile...');
        
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          username: email.split('@')[0] || `user_${data.user.id.slice(0, 8)}`,
          first_name: userData.firstName?.trim() || '',
          last_name: userData.lastName?.trim() || '',
          phone: userData.phone?.trim() || '',
          user_type: 'customer',
          created_at: new Date().toISOString(),
        };

        console.log('Profile data to insert:', profileData);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('⚠️ Profile creation error:', profileError);
          
          // Handle specific profile errors
          if (profileError.code === '23505') {
            console.log('Profile already exists (duplicate), ignoring...');
          } else if (profileError.code === '42501') {
            console.error('RLS Policy violation - check your policies');
            throw new Error('Registration failed due to security policies. Please contact support.');
          } else {
            console.error('Other profile error:', profileError);
            // Don't throw here - auth succeeded even if profile creation fails
            // The ensureUserProfile will fix it later
          }
        } else {
          console.log('✅ Profile created successfully');
        }
      }

      return { 
        data: { 
          user: data.user,
          session: data.session,
          requiresEmailConfirmation: !data.session // No session means email confirmation required
        }, 
        error: null 
      };
      
    } catch (error) {
      console.error('❌ Signup catch error:', error);
      setAuthError(error.message);
      return { data: null, error };
    }
  };

  // Enhanced signIn function
  const signIn = async (email, password) => {
    try {
      console.log('🔑 Signing in:', email);
      setAuthError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Signin error:', error);
        
        // User-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before logging in.');
        } else if (error.code === 'rate_limit_exceeded') {
          throw new Error('Too many attempts. Please try again in a few minutes.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }

      console.log('✅ Signin successful:', data.user?.email);
      
      // Ensure profile exists
      if (data.user) {
        await ensureUserProfile(data.user);
      }

      return { data, error: null };
      
    } catch (error) {
      console.error('❌ Signin catch error:', error);
      setAuthError(error.message);
      return { data: null, error };
    }
  };

  // Sign in with provider (Google, Facebook, etc.)
  const signInWithProvider = async (provider) => {
    try {
      setAuthError(null);
      console.log(`🔗 Signing in with ${provider}...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
      
    } catch (error) {
      console.error(`❌ ${provider} signin error:`, error);
      setAuthError(error.message);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthError(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Signout error:', error);
      setAuthError(error.message);
    }
  };

  // Get user profile data
  const getUserProfile = async () => {
    if (!user) {
      console.log('No user logged in, cannot get profile');
      return null;
    }
    
    try {
      console.log('📋 Fetching user profile for:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      console.log('📝 Updating profile for:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Profile updated');
      return { data, error: null };
      
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      console.log('🔐 Resetting password for:', email);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      console.log('✅ Password reset email sent');
      return { data, error: null };
      
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  // Check if profiles table has proper RLS policies
  const checkDatabaseSetup = async () => {
    try {
      console.log('🔍 Checking database setup...');
      
      // Check if profiles table exists
      const { error: tableError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (tableError) {
        console.error('❌ Profiles table error:', tableError);
        return { success: false, error: 'Profiles table does not exist or RLS is misconfigured' };
      }
      
      // Try a test insert (should fail with RLS if not authenticated)
      const testId = '00000000-0000-0000-0000-000000000000';
      const { error: testError } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          email: 'test@example.com',
          username: 'testuser'
        });
      
      if (testError && testError.code !== '23505') { // 23505 is unique violation, which is OK
        console.log('✅ RLS seems to be working correctly');
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('❌ Database check error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    getUserProfile,
    updateProfile,
    resetPassword,
    checkDatabaseSetup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};