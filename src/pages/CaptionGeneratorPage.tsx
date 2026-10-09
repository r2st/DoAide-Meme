import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { templates } from '../data/templates'
import { generateCaptions } from '../utils/api'
import type { Caption } from '../utils/api'

const TONES = ['Funny', 'Sarcastic', 'Dark Humor', 'Wholesome', 'Absurd', 'Relatable']

export default function CaptionGeneratorPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [tone, setTone] = useState('Funny')
  const [captions, setCaptions] = useState<Caption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setCaptions([])
    try {
      const result = await generateCaptions(topic.trim(), selectedTemplate || undefined, tone)
      setCaptions(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate captions')
    } finally {
      setLoading(false)
    }
  }

  const handleUseCaption = (caption: Caption) => {
    const templateId = selectedTemplate || 'blank'
    const params = new URLSearchParams({
      template: templateId,
      topText: caption.top,
      bottomText: caption.bottom,
    })
    navigate(`/create?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-amber-50 to-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            AI Meme Caption Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe a topic or scenario and our AI will generate funny meme captions for you.
            Free, no login required.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What's your meme about? *
            </label>
            <input
              type="text"
              placeholder='e.g. "Monday morning meetings", "when the code works on first try"'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={200}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Template (optional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
            >
              <option value="">Any template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    tone === t
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full py-3 bg-[#F0B429] text-gray-900 rounded-xl text-base font-bold hover:bg-[#D99E1E] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Generating...' : 'Generate Captions'}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
        </div>

        {captions.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Generated Captions</h2>
            {captions.map((caption, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg leading-snug">
                    {caption.top}
                  </p>
                  <p className="text-gray-600 mt-1">{caption.bottom}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUseCaption(caption)}
                  className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer"
                >
                  Use This
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How the AI Caption Generator Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Describe Your Topic</h3>
            <p className="text-sm text-gray-600">Tell the AI what your meme is about.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Get 5 Suggestions</h3>
            <p className="text-sm text-gray-600">AI generates 5 different caption ideas.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Create Your Meme</h3>
            <p className="text-sm text-gray-600">Click "Use This" to open the editor with your caption pre-filled.</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What AI model powers the captions?</h3>
            <p className="text-gray-600 text-sm">
              We use Google's Gemini AI to generate creative, context-aware meme captions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Is there a limit to how many captions I can generate?</h3>
            <p className="text-gray-600 text-sm">
              You can generate up to 10 sets of captions per minute. This keeps the service free for everyone.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Can I edit the generated captions?</h3>
            <p className="text-gray-600 text-sm">
              Yes! Click "Use This" to open the meme editor where you can modify the text however you like.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
