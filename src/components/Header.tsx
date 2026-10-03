import { Link } from 'react-router-dom'

export default function Header() {
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
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 no-underline hidden sm:block"
          >
            Templates
          </Link>
          <Link
            to="/create"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 no-underline"
          >
            Create Meme
          </Link>
        </nav>
      </div>
    </header>
  )
}
