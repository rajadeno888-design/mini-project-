import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based classifier if AI is unavailable or fails
function getHeuristicLeaveSuggestion(reason: string) {
  const lower = reason.toLowerCase();
  
  if (
    lower.includes('sick') ||
    lower.includes('fever') ||
    lower.includes('cold') ||
    lower.includes('headache') ||
    lower.includes('migraine') ||
    lower.includes('doctor') ||
    lower.includes('hospital') ||
    lower.includes('clinic') ||
    lower.includes('ill') ||
    lower.includes('infection') ||
    lower.includes('stomach') ||
    lower.includes('surgery') ||
    lower.includes('covid') ||
    lower.includes('unwell') ||
    lower.includes('medical')
  ) {
    return {
      suggestedType: 'Sick Leave',
      confidence: 0.95,
      explanation: 'Your reason indicates health issues or medical consultation which qualifies under Sick Leave.',
    };
  }

  if (
    lower.includes('emergency') ||
    lower.includes('accident') ||
    lower.includes('urgent') ||
    lower.includes('crisis') ||
    lower.includes('sudden') ||
    lower.includes('immediate') ||
    lower.includes('calamity') ||
    lower.includes('burglary') ||
    lower.includes('leakage')
  ) {
    return {
      suggestedType: 'Emergency Leave',
      confidence: 0.92,
      explanation: 'Your reason highlights an unexpected urgent situation requiring immediate absence under Emergency Leave.',
    };
  }

  if (
    lower.includes('baby') ||
    lower.includes('childbirth') ||
    lower.includes('maternity') ||
    lower.includes('paternity') ||
    lower.includes('delivery') ||
    lower.includes('newborn')
  ) {
    return {
      suggestedType: 'Maternity / Paternity Leave',
      confidence: 0.96,
      explanation: 'Your reason corresponds to parental care and childbirth entitlements.',
    };
  }

  if (
    lower.includes('vacation') ||
    lower.includes('tour') ||
    lower.includes('trip') ||
    lower.includes('holiday') ||
    lower.includes('travel') ||
    lower.includes('annual') ||
    lower.includes('trekking')
  ) {
    return {
      suggestedType: 'Earned Leave',
      confidence: 0.88,
      explanation: 'Planned leisure, holidays, and extended travel typically fall under Earned / Annual Leave.',
    };
  }

  // Default to Casual Leave for personal errands, functions, ceremonies, etc.
  return {
    suggestedType: 'Casual Leave',
    confidence: 0.85,
    explanation: 'General personal matters, social ceremonies, or short private commitments qualify as Casual Leave.',
  };
}

// AI API Endpoint: Suggest appropriate leave type from natural language reason
app.post('/api/suggest-leave-type', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      res.status(400).json({ error: 'Leave reason is required' });
      return;
    }

    const trimmedReason = reason.trim();

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this employee's leave reason and determine the most appropriate leave category from:
- "Sick Leave" (for medical illness, pain, doctor visits, surgery, recovery)
- "Casual Leave" (for personal errands, family functions, weddings, private commitments)
- "Emergency Leave" (for sudden crises, accidents, unforeseen urgent situations)
- "Earned Leave" (for planned vacations, family trips, annual holiday)
- "Maternity / Paternity Leave" (for childbirth and infant care)

Employee reason: "${trimmedReason}"`,
          config: {
            systemInstruction:
              'You are an HR Leave Classification Assistant in an employee management system. Classify the user reason into one of: "Sick Leave", "Casual Leave", "Emergency Leave", "Earned Leave", "Maternity / Paternity Leave". Return concise explanation and confidence score between 0.0 and 1.0.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                suggestedType: {
                  type: Type.STRING,
                  description: 'The selected leave type name',
                },
                confidence: {
                  type: Type.NUMBER,
                  description: 'Confidence score from 0.0 to 1.0',
                },
                explanation: {
                  type: Type.STRING,
                  description: 'A 1-2 sentence courteous explanation for why this category was recommended.',
                },
              },
              required: ['suggestedType', 'confidence', 'explanation'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({
            suggestedType: parsed.suggestedType || 'Casual Leave',
            confidence: parsed.confidence || 0.9,
            explanation: parsed.explanation || 'Categorized based on your submitted reason.',
            source: 'gemini',
          });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini model call failed, falling back to rule-based engine:', geminiError);
      }
    }

    // Heuristic fallback
    const fallback = getHeuristicLeaveSuggestion(trimmedReason);
    res.json({
      ...fallback,
      source: 'heuristic',
    });
  } catch (error) {
    console.error('Error classifying leave:', error);
    res.status(500).json({ error: 'Failed to classify leave request' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get('/', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'about.html'));
    });
    app.get(['/about', '/about.html'], (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'about.html'));
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');

    // Root route / and /about load the main showcase webpage first
    app.get(['/', '/about', '/about.html'], (_req, res) => {
      res.sendFile(path.resolve(distPath, 'about.html'));
    });

    // /login and /app routes load the React application
    app.get(['/login', '/app', '/dashboard'], (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
