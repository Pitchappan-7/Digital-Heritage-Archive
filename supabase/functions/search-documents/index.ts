/**
 * Edge Function: search-documents
 * Keyword search over published archive documents.
 * Semantic mode delegates to match_document_chunks once embeddings exist.
 *
 * Deploy with Supabase CLI. Secrets stay on the platform — never in the browser.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({
          error: 'Supabase connection error: SUPABASE_URL / SUPABASE_ANON_KEY not configured.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const body = await req.json();
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const mode = body.mode === 'semantic' || body.mode === 'hybrid' ? body.mode : 'keyword';
    const limit = typeof body.limit === 'number' ? body.limit : 20;

    if (!query) {
      return new Response(JSON.stringify({ query, mode, hits: [], total: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (mode !== 'keyword') {
      return new Response(
        JSON.stringify({
          error: `Search mode "${mode}" is not configured yet. Embeddings must be set up first.`,
        }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, error, count } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('verification_status', 'verified')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      return new Response(JSON.stringify({ error: `Database error: ${error.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        query,
        mode,
        hits: (data ?? []).map((document: Record<string, unknown>) => ({ document })),
        total: count ?? data?.length ?? 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown search error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
