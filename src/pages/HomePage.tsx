import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MemeTemplate, Category } from '../data/templates'
import { templates, CATEGORIES } from '../data/templates'
import { getRecentMemes } from '../utils/storage'
import TemplateCard from '../components/TemplateCard'

export default function HomePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const recentMemes = useMemo(() => getRecentMemes(), [])

  const filtered = useMemo(() => {
    let result = templates
    if (activeCategory !== 'All') {
      result = result.filter((t) => t.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, search])

  const handleSelectTemplate = (t: MemeTemplate) => {
    navigate(`/create?template=${t.id}`)
  }

  const handleUploadCreate = () => {
    navigate('/create')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-12 sm:py-20 px-4 text-center bg-gradient-to-b from-amber-50 to-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Create Memes <span className="text-[#F0B429]">Instantly</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Pick a template, add your text, download and share. No login, no watermarks*, completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleUploadCreate}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-base font-medium hover:bg-gray-800 cursor-pointer"
          >
            Upload Your Image
          </button>
          <a
            href="#templates"
            className="bg-white text-gray-900 px-8 py-3 rounded-xl text-base font-medium border border-gray-200 hover:bg-gray-50 no-underline"
          >
            Browse Templates
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          *Tiny "meme.doaide.com" credit on memes — helps us stay free!
        </p>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Templates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {templates.slice(0, 6).map((t) => (
            <TemplateCard key={t.id} template={t} onClick={handleSelectTemplate} />
          ))}
        </div>
      </section>

      {/* Recent Memes */}
      {recentMemes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Memes</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentMemes.slice(0, 8).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/create?template=${m.templateId}`)}
                className="flex-shrink-0 w-32 rounded-lg overflow-hidden border border-gray-200 hover:border-[#F0B429] cursor-pointer bg-white"
              >
                <img
                  src={m.thumbnail}
                  alt={m.templateName}
                  className="w-full aspect-square object-cover"
                />
                <p className="text-xs text-gray-600 p-2 truncate">{m.templateName}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Template Gallery */}
      <section id="templates" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Templates</h2>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} onClick={handleSelectTemplate} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-lg">No templates found.</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or category.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-12 px-4 text-center mt-8">
        <h2 className="text-2xl font-bold mb-3">Can't find the right template?</h2>
        <p className="text-gray-400 mb-6">Upload your own image and create a custom meme from scratch.</p>
        <button
          type="button"
          onClick={handleUploadCreate}
          className="bg-[#F0B429] text-gray-900 px-8 py-3 rounded-xl text-base font-bold hover:bg-[#D99E1E] cursor-pointer"
        >
          Create from Scratch
        </button>
      </section>
    </div>
  )
}
