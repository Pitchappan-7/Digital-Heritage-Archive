import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { ArchiveEvent, EventInsert, DocumentEvent } from '../types/event';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[events] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

export const eventsService = {
  async list(limit = 50): Promise<ArchiveEvent[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`[events] Database error: ${error.message}`);
    }
    return (data ?? []) as ArchiveEvent[];
  },

  async create(input: EventInsert): Promise<ArchiveEvent> {
    ensureConfigured();
    const { data, error } = await supabase.from('events').insert(input).select('*').single();
    if (error) {
      throw new Error(`[events] Database error: ${error.message}`);
    }
    return data as ArchiveEvent;
  },

  async linkToDocument(documentId: string, eventId: string): Promise<DocumentEvent> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('document_events')
      .insert({ document_id: documentId, event_id: eventId })
      .select('*')
      .single();

    if (error) {
      throw new Error(`[events] Database error: ${error.message}`);
    }
    return data as DocumentEvent;
  },
};
