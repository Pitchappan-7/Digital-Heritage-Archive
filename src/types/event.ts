export interface ArchiveEvent {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventInsert {
  name: string;
  description?: string | null;
  event_date?: string | null;
  location_id?: string | null;
}

export interface DocumentEvent {
  document_id: string;
  event_id: string;
}
