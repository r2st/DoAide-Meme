import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Free Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Template Browser
                </Link>
              </li>
              <li>
                <Link to="/custom-meme-creator" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Custom Meme Creator
                </Link>
              </li>
              <li>
                <Link to="/caption-generator" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  AI Caption Generator
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Meme Editor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/blog/how-to-make-memes-that-go-viral" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  How to Make Viral Memes
                </Link>
              </li>
              <li>
                <Link to="/blog/best-meme-templates-2026" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Best Templates 2026
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Reaction Memes
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Drake Format
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm text-gray-500 hover:text-gray-700 no-underline">
                  Indian Memes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">About</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://doaide.com"
                  className="text-sm text-gray-500 hover:text-gray-700 no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DoAide.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-900 font-bold">DoAide</span>
            <span className="text-[#F0B429] font-bold italic">Meme</span>
          </div>
          <p className="text-sm text-gray-400">
            Free meme generator. No login required. &copy; {new Date().getFullYear()} DoAide.
          </p>
        </div>
      </div>
    </footer>
  )
}
