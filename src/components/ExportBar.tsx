import { useState } from 'react'
import { FiDownload, FiShare2 } from 'react-icons/fi'
import { FaWhatsapp, FaTwitter } from 'react-icons/fa'

interface Props {
  onDownload: (format: 'png' | 'jpg') => void
  onShareWhatsApp: () => void
  onShareTwitter: () => void
  onShareNative: () => void
}

export default function ExportBar({ onDownload, onShareWhatsApp, onShareTwitter, onShareNative }: Props) {
  const [showFormats, setShowFormats] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFormats(!showFormats)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer"
          >
            <FiDownload size={16} />
            Download
          </button>
          {showFormats && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                type="button"
                onClick={() => { onDownload('png'); setShowFormats(false) }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                PNG (high quality)
              </button>
              <button
                type="button"
                onClick={() => { onDownload('jpg'); setShowFormats(false) }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                JPG (smaller file)
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onShareWhatsApp}
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#20bd5a] cursor-pointer"
        >
          <FaWhatsapp size={16} />
          WhatsApp
        </button>

        <button
          type="button"
          onClick={onShareTwitter}
          className="flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a91da] cursor-pointer"
        >
          <FaTwitter size={16} />
          Twitter
        </button>

        <button
          type="button"
          onClick={onShareNative}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer"
        >
          <FiShare2 size={16} />
          Share
        </button>
      </div>
    </div>
  )
}
