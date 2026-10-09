import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 no-underline">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-[#F0B429] font-bold text-sm">M</span>
          </div>
          <span className="text-gray-900 font-bold text-lg">DoAide</span>
          <span className="text-[#F0B429] font-bold text-lg italic">Meme</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link to="/templates" className="text-sm text-gray-600 hover:text-gray-900 no-underline">
            Templates
          </Link>
          <Link to="/custom-meme-creator" className="text-sm text-gray-600 hover:text-gray-900 no-underline">
            Custom Creator
          </Link>
          <Link to="/caption-generator" className="text-sm text-gray-600 hover:text-gray-900 no-underline">
            AI Captions
          </Link>
          <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900 no-underline">
            Blog
          </Link>
          <Link
            to="/create"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 no-underline"
          >
            Create Meme
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600 cursor-pointer"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link
            to="/templates"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 no-underline"
          >
            Template Browser
          </Link>
          <Link
            to="/custom-meme-creator"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 no-underline"
          >
            Custom Meme Creator
          </Link>
          <Link
            to="/caption-generator"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 no-underline"
          >
            AI Caption Generator
          </Link>
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-gray-700 no-underline"
          >
            Blog
          </Link>
          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm bg-gray-900 text-white text-center rounded-lg no-underline"
          >
            Create Meme
          </Link>
        </nav>
      )}
    </header>
  )
}
