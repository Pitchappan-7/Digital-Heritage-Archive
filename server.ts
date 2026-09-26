import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { healthRouter } from './server/routes/health';
import { documentsRouter } from './server/routes/documents';
import { searchRouter } from './server/routes/search';
import { askRouter } from './server/routes/ask';
import { uploadRouter } from './server/routes/upload';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Shared server-side Gemini client with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Foundation API routes (Supabase / RAG architecture)
app.use('/api', healthRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/search', searchRouter);
app.use('/api/ask', askRouter);
app.use('/api/upload', uploadRouter);

// Multi-turn Gemini Chatbot with specific role system instructions
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model = 'gemini-3.5-flash', role = 'chief_historian' } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure an API key is set in Settings > Secrets.',
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Role-specific System Instructions
    const roleInstructions: Record<string, string> = {
      chief_historian:
        'You are the Chief Archival Historian of the Digital Heritage Archive. You specialize in modern Indian history, social reform movements, Dr. B. R. Ambedkar\'s intellectual and political oeuvre, the Mahad Satyagraha, Poona Pact, Round Table Conferences, and historical archives. Ground all responses in primary sources, citing archival accession numbers (e.g. DHA-1936-BK-0082, NAI-CA-IV-48), dates, document types, and verified repositories (e.g. National Archives of India, Columbia University Special Collections, Bombay University). Speak with authoritative, elegant, and scholarly prose.',
      constitutional_scholar:
        'You are a Senior Constitutional Jurisprudence Scholar. You specialize in the Constituent Assembly Debates (1946–1950), the drafting of the Indian Constitution by Dr. B. R. Ambedkar\'s Drafting Committee, Fundamental Rights (Articles 12–35), Directive Principles of State Policy, and legal hermeneutics. Reference specific draft leaves, amendments, Constituent Assembly volume reports (CAD), and exact constitutional wording.',
      paleographic_archivist:
        'You are a Paleographic Archivist and Document Conservator. You specialize in manuscript physical preservation, iron gall ink analysis, Waterman fountain pen blue ink annotations, 600–1200 DPI archival scans, de-acidification box preservation, OCR/HTR accuracy, and Dublin Core v3.2 / ISO-16363 metadata compliance.',
      research_synthesis:
        'You are a Curatorial Research Synthesis Specialist. Synthesize historical research inquiries with structured analytical headings, verbatim primary source quotations, exact document accession numbers, and linked historical ontology entities (people, institutions, events, concepts).',
    };

    const systemInstruction = roleInstructions[role] || roleInstructions.chief_historian;

    // Build contents for multi-turn chat
    // Last message is the current user prompt
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Choose model: gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks, gemini-3.1-flash-lite for fast tasks
    const validModels = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const chosenModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No response generated from archive model.';
    res.json({
      reply,
      modelUsed: chosenModel,
      role,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to communicate with the archival intelligence engine.',
    });
  }
});

// Image Generation using gemini-3-pro-image-preview with 1K, 2K, 4K imageSize affordance
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      imageSize = '1K',
      aspectRatio = '1:1',
      model = 'gemini-3-pro-image-preview',
    } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure an API key is set in Settings > Secrets.',
      });
    }

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Validate imageSize (1K, 2K, 4K)
    const validSizes = ['1K', '2K', '4K'];
    const validatedSize = validSizes.includes(imageSize) ? (imageSize as '1K' | '2K' | '4K') : '1K';

    // Validate aspectRatio
    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const validatedAspect = validAspectRatios.includes(aspectRatio)
      ? (aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9')
      : '1:1';

    // Fallback model list if gemini-3-pro-image-preview needs fallback
    const modelsToTry = [
      model || 'gemini-3-pro-image-preview',
      'gemini-3-pro-image',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;
    let base64Image: string | null = null;
    let mimeType = 'image/png';
    let successfulModel = '';

    for (const currentModel of modelsToTry) {
      try {
        const isFlashLite = currentModel === 'gemini-3.1-flash-lite-image';
        const config: any = {};
        if (!isFlashLite) {
          config.imageConfig = {
            aspectRatio: validatedAspect,
            imageSize: validatedSize,
          };
        }

        const response = await ai.models.generateContent({
          model: currentModel,
          contents: {
            parts: [{ text: prompt }],
          },
          config,
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            base64Image = part.inlineData.data;
            mimeType = part.inlineData.mimeType || 'image/png';
            successfulModel = currentModel;
            break;
          }
        }

        if (base64Image) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${currentModel} image generation attempt failed:`, err?.message);
      }
    }

    if (!base64Image) {
      throw lastError || new Error('No image was returned by the generative model.');
    }

    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    res.json({
      imageUrl,
      prompt,
      imageSize: validatedSize,
      aspectRatio: validatedAspect,
      modelUsed: successfulModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Image Generation API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate archival image asset.',
    });
  }
});

// Research Synthesis Endpoint for "Ask the Archive"
app.post('/api/synthesize-research', async (req: Request, res: Response) => {
  try {
    const { query, language = 'English', mode = 'Standard Research Synthesis' } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
    }

    const systemInstruction = `You are the primary Scholarly Synthesis Engine of the Digital Heritage Archive.
You synthesize historical and constitutional queries strictly grounded in primary sources (manuscripts, gazettes, assembly debates, letters, recorded speeches).
For the query provided, output a scholarly research synthesis in the requested language (${language}) and depth (${mode}).
Always structure your response with:
1. Executive Scholarly Thesis
2. Key Thematic Sections with Roman numerals (I., II., III., etc.)
3. An exact Verbatim Primary Excerpt formatted with quotation marks, speaker, date, and Archival Accession Code (format: #DHA-YYYY-XX-NNN)
4. Primary Sources Cited list with titles, dates, repositories, and estimated relevance match percentage
5. Linked Archival Entities (Person, Institution, Event, Concept, Entity)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Perform an archival research synthesis for this inquiry: "${query}" in language: ${language}. Mode: ${mode}.`,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({
      synthesis: response.text,
      query,
      language,
      mode,
    });
  } catch (error: any) {
    console.error('Synthesis API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to synthesize archival research.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Digital Heritage Archive Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
