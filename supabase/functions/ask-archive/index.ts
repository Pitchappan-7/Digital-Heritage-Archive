/**
 * Edge Function: ask-archive
 * RAG entrypoint: question → embedding → vector search → Gemini → answer + sources.
 * Returns a clear not-configured response until embeddings + Gemini secrets are set.
 * Never fabricates answers or source citations.
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
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return new Response(JSON.stringify({ error: 'question is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured on the Edge Function.',
          code: 'GEMINI_NOT_CONFIGURED',
          answer: null,
          sources: [],
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Full RAG pipeline (embed → match_document_chunks → Gemini) is deferred
    // until the embedding model is selected. Do not invent chunks or citations.
    return new Response(
      JSON.stringify({
        error: 'RAG pipeline is not fully configured (embeddings pending).',
        code: 'RAG_NOT_CONFIGURED',
        answer: null,
        sources: [],
        question,
      }),
      { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ask-archive error';
    return new Response(JSON.stringify({ error: message, code: 'RAG_ERROR', sources: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
