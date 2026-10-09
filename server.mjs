import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3052
const HOST = process.env.HOST || '172.18.0.1'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

app.use(express.json({ limit: '1kb' }))
app.use(express.static(join(__dirname, 'dist'), { maxAge: '7d' }))

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 10

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 })
    return next()
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' })
  }
  next()
}

app.post('/api/generate-caption', rateLimit, async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const { template, topic, tone } = req.body
  if (!topic || typeof topic !== 'string' || topic.length > 200) {
    return res.status(400).json({ error: 'Topic is required (max 200 chars)' })
  }

  const templateLabel = template ? `"${String(template).slice(0, 60)}" meme` : 'general meme'
  const toneLabel = tone && typeof tone === 'string' ? tone.slice(0, 30) : 'funny'

  const prompt = `Generate 5 funny and creative meme captions for a ${templateLabel} about "${topic}". Tone: ${toneLabel}. Each caption should have top text and bottom text suitable for a meme image. Return ONLY a JSON array of objects with "top" and "bottom" string fields. No markdown, no explanation.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
        }),
      }
    )
    const data = await response.json()
    if (data.error) {
      console.error('Gemini API error:', data.error.message)
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again later.' })
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    const captions = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    res.json({ captions: captions.slice(0, 5) })
  } catch (err) {
    console.error('Caption generation error:', err)
    res.status(500).json({ error: 'Failed to generate captions. Please try again.' })
  }
})

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(Number(PORT), HOST, () => {
  console.log(`DoAide Meme running on http://${HOST}:${PORT}`)
})
