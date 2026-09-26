import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Person, PersonInsert, DocumentPerson } from '../types/person';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[people] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

export const peopleService = {
  async list(limit = 50): Promise<Person[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`[people] Database error: ${error.message}`);
    }
    return (data ?? []) as Person[];
  },

  async create(input: PersonInsert): Promise<Person> {
    ensureConfigured();
    const { data, error } = await supabase.from('people').insert(input).select('*').single();
    if (error) {
      throw new Error(`[people] Database error: ${error.message}`);
    }
    return data as Person;
  },

  async linkToDocument(
    documentId: string,
    personId: string,
    relationshipType?: string | null
  ): Promise<DocumentPerson> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('document_people')
      .insert({
        document_id: documentId,
        person_id: personId,
        relationship_type: relationshipType ?? null,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`[people] Database error: ${error.message}`);
    }
    return data as DocumentPerson;
  },
};
