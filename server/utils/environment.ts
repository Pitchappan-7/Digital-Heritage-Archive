/**
 * Server environment helpers.
 * Secrets (GEMINI_API_KEY, service role) stay on the server only.
 */

export interface ServerEnv {
  port: number;
  geminiApiKey: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
  supabaseServiceRoleKey: string;
  nodeEnv: string;
}

export function getServerEnv(): ServerEnv {
  return {
    port: Number(process.env.PORT || 3000),
    geminiApiKey: (process.env.GEMINI_API_KEY || '').trim(),
    supabaseUrl: (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ''
    ).trim(),
    supabasePublishableKey: (
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      ''
    ).trim(),
    supabaseServiceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

export function isGeminiConfigured(): boolean {
  return Boolean(getServerEnv().geminiApiKey);
}

export function isSupabaseServerConfigured(): boolean {
  const env = getServerEnv();
  return Boolean(env.supabaseUrl && env.supabasePublishableKey);
}
