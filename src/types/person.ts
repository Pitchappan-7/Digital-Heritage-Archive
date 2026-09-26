export interface Person {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonInsert {
  name: string;
  description?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
}

export interface DocumentPerson {
  document_id: string;
  person_id: string;
  relationship_type: string | null;
}
