/**
 * Edge Function: generate-embedding
 * Service boundary for document/query embeddings.
 * Does NOT return fake vectors — returns 501 until a model is configured.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Embedding model not selected yet — do not fabricate vectors.
    return new Response(
      JSON.stringify({
        error: 'Embedding model is not configured.',
        code: 'EMBEDDING_NOT_CONFIGURED',
        message:
          'Select an embedding model and wire generate-embedding before semantic search / RAG.',
      }),
      { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Embedding error';
    return new Response(JSON.stringify({ error: message, code: 'EMBEDDING_ERROR' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
