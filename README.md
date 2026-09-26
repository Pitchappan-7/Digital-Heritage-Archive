# Digital Heritage Archive

## Overview
Digital Heritage Archive is an AI-powered digital heritage archiving platform for digitizing, preserving, searching, and exploring historical materials such as manuscripts, books, letters, photographs, newspapers, speeches, audio recordings, and video footage.

The application combines a modern web interface with a robust backend and vector search capabilities to enable deep search, metadata categorization, document citation, and retrieval-augmented generation (RAG) over historical collections.

## Core Pipeline

```
Physical Heritage
→ Digitization
→ OCR / HTR
→ Text + Metadata
→ Supabase Storage / PostgreSQL
→ Document Chunks
→ Embeddings
→ Vector Search
→ RAG
→ Gemini
→ Answer + Source Citations
```

## Features

### Currently Implemented
- **Digital Document Archive:** Browse, view, filter, and organize historical archive items.
- **Document Metadata:** Schema and interface for rich metadata (dates, authors, tags, formats, locations, entity links).
- **Supabase Database Integration:** PostgreSQL database schema with core tables for documents, chunks, and metadata.
- **Supabase Storage Integration:** Private bucket storage management for raw files and media.
- **Authentication Framework:** Supabase Auth integration supporting user roles and access control.
- **Backend Server API:** Node.js Express server (`server.ts`) with custom service modules and API routing.
- **Keyword Search & Filter:** Full text and attribute-based search over cataloged documents.

### Under Development / Architectural Stubs
- **OCR/HTR Pipeline Architecture:** Automated text extraction for printed materials (PaddleOCR / Tesseract) and handwritten historical manuscripts (HTR).
- **Document Chunking & Embeddings:** Automated passage splitting and vector embedding generation.
- **Semantic / Vector Search:** High-dimensional vector search using `pgvector`.
- **RAG Question Answering:** Retrieval-Augmented Generation using the Gemini API to answer queries with contextual archive precision.
- **Source Citation System:** Verifiable link back from generated answers to specific page numbers and document coordinates.
- **Translation & Text-to-Speech Architecture:** Automated translation for multilingual historical texts and TTS narration generation.
- **Entity & Knowledge Graph Architecture:** Interlinked entities for People, Events, and Locations represented across timelines, maps, and knowledge graphs.

## Technology Stack

### Frontend
- **React**
- **TypeScript**
- **Vite**

### Backend
- **Node.js**
- **TypeScript**
- **tsx**
- **API routes**

### Database
- **Supabase**
- **PostgreSQL**
- **pgvector**

### AI
- **Gemini API**
- **RAG**

### OCR
- **PaddleOCR / Tesseract**
- **HTR architecture for historical handwriting**

### Other
- **OpenCV**
- **FFmpeg**
- **Leaflet / OpenStreetMap**

## Project Structure

```
Digital Heritage/
├── server.ts                 # Express server entry point
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── index.html                # HTML template entry
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusion rules
│
├── src/                      # React Frontend Application
│   ├── components/           # UI components and archive views
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Supabase client and API services
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Helper utilities and formatters
│   └── lib/                  # Shared libraries and client configurations
│
├── server/                   # Node.js Express Backend
│   ├── routes/               # Express API endpoints
│   ├── services/             # Server-side AI, OCR, and embedding services
│   └── utils/                # Backend utilities
│
└── supabase/                 # Supabase Infrastructure & Migrations
    ├── migrations/           # SQL migration files (schema, RLS, indexes, pgvector)
    └── functions/            # Supabase Edge Function stubs
```

## Local Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   GEMINI_API_KEY=...
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

The application runs on **http://localhost:3000**.

## Supabase Setup

The SQL migrations inside:

`supabase/migrations/`

must be applied to a Supabase project in the correct numeric order:
1. `001_initial_archive_schema.sql`
2. `002_indexes_and_rls.sql`
3. `003_storage_setup.sql`
4. `004_vector_setup.sql`

## Security

- **Never commit `.env.local`** to version control.
- **Never commit Gemini API keys** or active API tokens.
- **Never commit Supabase service-role keys** to repository commits.
- **Supabase RLS must protect database access** to prevent unauthorized read/write access.
- **Private storage should remain protected** using signed URLs.
- **Server-side secrets must not be exposed to the browser.**
