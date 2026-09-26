import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[auth] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

/**
 * Supabase Auth service layer — connect to UI later without redesigning login.
 */
export const authService = {
  async signIn(email: string, password: string): Promise<Session> {
    ensureConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(`[auth] Authentication error: ${error.message}`);
    }
    if (!data.session) {
      throw new Error('[auth] Authentication error: No session returned.');
    }
    return data.session;
  },

  async signUp(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    ensureConfigured();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(`[auth] Authentication error: ${error.message}`);
    }
    return { user: data.user, session: data.session };
  },

  async signOut(): Promise<void> {
    ensureConfigured();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`[auth] Authentication error: ${error.message}`);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    ensureConfigured();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(`[auth] Authentication error: ${error.message}`);
    }
    return data.user;
  },

  async getSession(): Promise<Session | null> {
    ensureConfigured();
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(`[auth] Authentication error: ${error.message}`);
    }
    return data.session;
  },
};
