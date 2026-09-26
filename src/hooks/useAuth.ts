import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';
import { isSupabaseConfigured } from '../lib/supabase';

export interface UseAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Auth hook backed by Supabase Auth. Does not alter existing UI.
 */
export function useAuth(): UseAuthState {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nextSession = await authService.getSession();
      setSession(nextSession);
      setUser(nextSession?.user ?? (await authService.getCurrentUser()));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load session.';
      setError(message);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    await authService.signIn(email, password);
    await refresh();
  }, [refresh]);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    await authService.signUp(email, password);
    await refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    setError(null);
    await authService.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return {
    user,
    session,
    loading,
    error,
    configured,
    signIn,
    signUp,
    signOut,
    refresh,
  };
}
