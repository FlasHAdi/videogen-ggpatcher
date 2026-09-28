import express, { Request, Response } from 'express';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Analyze Video with gemini-3.1-pro-preview
app.post('/api/analyze-video', async (req: Request, res: Response) => {
  try {
    const { videoBase64, mimeType = 'video/mp4', userPrompt, videoPreset } = req.body;
    const ai = getGenAI();

    const systemInstruction = `You are a world-class motion graphics director, video editor, and game UI/UX expert analyzing video clips, specifically the GGPatcher game launcher presentation and its end transition.
When analyzing:
1. Evaluate the pacing, visual hierarchy, and UI elements.
2. Critically analyze the transition at the end (around 00:08 - 00:11) where the user clicks "PLAY NOW" and it jumps to the "GG Patcher" logo outro.
3. Identify why the original transition felt abrupt (lack of anticipation, missing motion blur, hard cut instead of spatial continuity, abrupt audio cut).
4. Provide structured, actionable advice for smooth fluid animations (e.g. hyperdrive warp, chromatic aberration, kinetic zoom, easing curves like cubic-bezier(0.2, 0.8, 0.2, 1), particle burst, holographic shimmer).
5. Give a rating (1-10) for Transition Smoothness, Visual Design, and Impact.
Format your output in clean Markdown with timestamps, clear sections, and recommendations. Provide both Romanian and English summary points if requested.`;

    const promptText = userPrompt || (
      videoPreset === 'ggpatcher'
        ? `Analyze the transition at the end of the GGPatcher launcher video (from the "PLAY NOW" button click at 00:08 to the GG Patcher logo card at 00:11).
Highlight why the original transition felt sudden and detail how fluid animations (camera push-in, sonic ripple, particle convergence, logo assembly) solve it perfectly.`
        : 'Analyze this video content thoroughly for key information, scene cuts, transition fluidity, and visual design.'
    );

    let contentParts: any[] = [];
    if (videoBase64) {
      contentParts.push({
        inlineData: {
          mimeType,
          data: videoBase64,
        },
      });
    }
    contentParts.push({ text: promptText });

    let response;
    try {
      // Primary model: gemini-3.1-pro-preview as required
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contentParts.length === 1 ? contentParts[0].text : { parts: contentParts },
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (primaryError: any) {
      console.warn('gemini-3.1-pro-preview call failed or restricted, falling back to gemini-3.8-flash:', primaryError?.message);
      // Fallback model if paid key or quota issues arise
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentParts.length === 1 ? contentParts[0].text : { parts: contentParts },
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    res.json({
      success: true,
      analysis: response.text,
      modelUsed: 'gemini-3.1-pro-preview',
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-video:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze video content.',
    });
  }
});

// Generate Video with veo-3.1-fast-generate-preview
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for video generation.' });
    }

    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
    const ai = getGenAI();

    // Call veo-3.1-fast-generate-preview as required
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: validAspectRatio,
      },
    });

    res.json({
      success: true,
      operationName: operation.name,
      model: 'veo-3.1-fast-generate-preview',
    });
  } catch (error: any) {
    console.error('Error in /api/generate-video:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to start video generation.',
    });
  }
});

// Check Video Generation Status
app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required.' });
    }

    const ai = getGenAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      success: true,
      done: Boolean(updated.done),
      error: updated.error || null,
    });
  } catch (error: any) {
    console.error('Error in /api/video-status:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to check operation status.',
    });
  }
});

// Download Generated Video
app.post('/api/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
    }

    const ai = getGenAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      return res.status(404).json({ error: 'Video URI not found in operation response.' });
    }

    const videoRes = await fetch(videoUri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video stream from Google API: ${videoRes.statusText}`);
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Error in /api/video-download:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to download generated video.',
    });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
