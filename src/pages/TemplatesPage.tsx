import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { templates, CATEGORIES } from '../data/templates'
import type { MemeTemplate, Category } from '../data/templates'
import TemplateCard from '../components/TemplateCard'

export default function TemplatesPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const [layout, setLayout] = useState<'grid' | 'compact'>('grid')

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

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-amber-50 to-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Free Meme Template Browser
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse {templates.length}+ meme templates. Pick one, add your text, and download instantly.
            No login required.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                layout === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setLayout('compact')}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                layout === 'compact' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? templates.length
                : templates.filter((t) => t.category === cat).length
            return (
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
                {cat} ({count})
              </button>
            )
          })}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        </p>

        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'
          }
        >
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

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Is DoAide Meme really free?</h3>
            <p className="text-gray-600 text-sm">
              Yes, completely free. No login, no subscription, no hidden fees. Create and download
              unlimited memes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Can I use these memes commercially?</h3>
            <p className="text-gray-600 text-sm">
              The memes you create are yours. Template layouts are free to use. If a template
              references a copyrighted character, fair use for parody and commentary generally
              applies.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Can I upload my own images?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely. Use our <a href="/custom-meme-creator" className="text-[#F0B429] hover:underline">Custom Meme Creator</a> to
              upload any image and add text overlays.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Do you have an AI caption generator?</h3>
            <p className="text-gray-600 text-sm">
              Yes! Our <a href="/caption-generator" className="text-[#F0B429] hover:underline">AI Caption Generator</a> uses
              AI to suggest funny captions for any meme template or topic.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
