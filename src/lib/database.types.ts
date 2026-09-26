/**
 * Supabase Database types aligned with supabase/migrations/*.sql
 *
 * Regenerate later with: supabase gen types typescript
 * Embedding vector dimension is intentionally unset until the model is chosen.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** pgvector column — dimension deferred until embedding model selection. */
export type VectorEmbedding = number[];

type Timestamptz = string;
type DateOnly = string;

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          document_type: string | null;
          language: string | null;
          date_created: DateOnly | null;
          date_digitized: DateOnly | null;
          location_id: string | null;
          source_id: string | null;
          status: string | null;
          verification_status: string | null;
          created_at: Timestamptz;
          updated_at: Timestamptz;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          document_type?: string | null;
          language?: string | null;
          date_created?: DateOnly | null;
          date_digitized?: DateOnly | null;
          location_id?: string | null;
          source_id?: string | null;
          status?: string | null;
          verification_status?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          document_type?: string | null;
          language?: string | null;
          date_created?: DateOnly | null;
          date_digitized?: DateOnly | null;
          location_id?: string | null;
          source_id?: string | null;
          status?: string | null;
          verification_status?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_source_id_fkey';
            columns: ['source_id'];
            isOneToOne: false;
            referencedRelation: 'sources';
            referencedColumns: ['id'];
          },
        ];
      };
      people: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          birth_date: DateOnly | null;
          death_date: DateOnly | null;
          created_at: Timestamptz;
          updated_at: Timestamptz;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          birth_date?: DateOnly | null;
          death_date?: DateOnly | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          birth_date?: DateOnly | null;
          death_date?: DateOnly | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Relationships: [];
      };
      document_people: {
        Row: {
          document_id: string;
          person_id: string;
          relationship_type: string | null;
        };
        Insert: {
          document_id: string;
          person_id: string;
          relationship_type?: string | null;
        };
        Update: {
          document_id?: string;
          person_id?: string;
          relationship_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'document_people_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_people_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'people';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          event_date: DateOnly | null;
          location_id: string | null;
          created_at: Timestamptz;
          updated_at: Timestamptz;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          event_date?: DateOnly | null;
          location_id?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          event_date?: DateOnly | null;
          location_id?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'events_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
        ];
      };
      document_events: {
        Row: {
          document_id: string;
          event_id: string;
        };
        Insert: {
          document_id: string;
          event_id: string;
        };
        Update: {
          document_id?: string;
          event_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'document_events_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_events_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
        ];
      };
      locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          created_at: Timestamptz;
          updated_at: Timestamptz;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          id: string;
          institution_name: string | null;
          archive_name: string | null;
          collection_name: string | null;
          catalog_reference: string | null;
          source_url: string | null;
          description: string | null;
          created_at: Timestamptz;
          updated_at: Timestamptz;
        };
        Insert: {
          id?: string;
          institution_name?: string | null;
          archive_name?: string | null;
          collection_name?: string | null;
          catalog_reference?: string | null;
          source_url?: string | null;
          description?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Update: {
          id?: string;
          institution_name?: string | null;
          archive_name?: string | null;
          collection_name?: string | null;
          catalog_reference?: string | null;
          source_url?: string | null;
          description?: string | null;
          created_at?: Timestamptz;
          updated_at?: Timestamptz;
        };
        Relationships: [];
      };
      document_metadata: {
        Row: {
          id: string;
          document_id: string;
          metadata_key: string;
          metadata_value: string | null;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          document_id: string;
          metadata_key: string;
          metadata_value?: string | null;
          created_at?: Timestamptz;
        };
        Update: {
          id?: string;
          document_id?: string;
          metadata_key?: string;
          metadata_value?: string | null;
          created_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'document_metadata_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_files: {
        Row: {
          id: string;
          document_id: string;
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          mime_type: string | null;
          file_size: number | null;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          document_id: string;
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          mime_type?: string | null;
          file_size?: number | null;
          created_at?: Timestamptz;
        };
        Update: {
          id?: string;
          document_id?: string;
          storage_bucket?: string;
          storage_path?: string;
          file_name?: string;
          mime_type?: string | null;
          file_size?: number | null;
          created_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'document_files_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string;
          page_number: number | null;
          chunk_index: number;
          content: string;
          language: string | null;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          document_id: string;
          page_number?: number | null;
          chunk_index: number;
          content: string;
          language?: string | null;
          created_at?: Timestamptz;
        };
        Update: {
          id?: string;
          document_id?: string;
          page_number?: number | null;
          chunk_index?: number;
          content?: string;
          language?: string | null;
          created_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'document_chunks_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_embeddings: {
        Row: {
          id: string;
          document_chunk_id: string;
          embedding: VectorEmbedding | null;
          model: string | null;
          created_at: Timestamptz;
        };
        Insert: {
          id?: string;
          document_chunk_id: string;
          embedding?: VectorEmbedding | null;
          model?: string | null;
          created_at?: Timestamptz;
        };
        Update: {
          id?: string;
          document_chunk_id?: string;
          embedding?: VectorEmbedding | null;
          model?: string | null;
          created_at?: Timestamptz;
        };
        Relationships: [
          {
            foreignKeyName: 'document_embeddings_document_chunk_id_fkey';
            columns: ['document_chunk_id'];
            isOneToOne: false;
            referencedRelation: 'document_chunks';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: VectorEmbedding;
          match_count?: number;
          match_threshold?: number;
        };
        Returns: {
          chunk_id: string;
          document_id: string;
          content: string;
          page_number: number | null;
          similarity: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
