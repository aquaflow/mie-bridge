import 'dotenv/config';
import express from 'express';
import { OpenAI } from 'openai';

const app = express();
app.use(express.json({ limit: '1mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.MIE_MODEL || 'gpt-4o-mini';
const PORT = process.env.PORT || 10000; // Render provides PORT

const BRIDGE_SECRET = process.env.MIE_BRIDGE_SECRET || '';
app.use((req, res, next) => {
  if (!BRIDGE_SECRET) return next();
  if (req.headers['x-mie-secret'] !== BRIDGE_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

function toAlexaSafe(text) {
  const max = 7000;
  let s = (text || '').toString().replace(/[<>&]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[ch]));
  if (s.length > max) s = s.slice(0, max - 3) + '...';
  return s;
}

app.post('/api/mie', async (req, res) => {
  try {
    const { query, locale = 'en-US' } = req.body || {};
    if (!query || typeof query !== 'string') return res.status(400).json({ error: 'Missing query' });

    const system = `You are MIE (My Intelligent Explorer). Speak naturally for voice. Be concise and kind. 2–5 sentences unless asked for more.`;
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: query }
      ],
      temperature: 0.6,
      max_tokens: 400
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() || "I couldn't find an answer.";
    res.json({ speech: toAlexaSafe(answer), cardText: answer });
  } catch (e) {
    console.error('Bridge error:', e);
    res.status(500).json({ error: 'Bridge failure' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`MIE bridge listening on :${PORT}`));
