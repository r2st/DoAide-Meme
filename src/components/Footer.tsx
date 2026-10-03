export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-900 font-bold">DoAide</span>
            <span className="text-[#F0B429] font-bold italic">Meme</span>
          </div>
          <p className="text-sm text-gray-500">
            Free meme generator. No login required.
          </p>
          <a
            href="https://doaide.com"
            className="text-sm text-gray-400 hover:text-gray-600 no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            doaide.com
          </a>
        </div>
      </div>
    </footer>
  )
}
