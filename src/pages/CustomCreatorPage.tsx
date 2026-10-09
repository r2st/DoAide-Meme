import { useState, useRef, useEffect, useCallback } from 'react'
import { FiUpload, FiDownload } from 'react-icons/fi'

interface TextOverlay {
  text: string
  fontSize: number
  color: string
  outlineColor: string
  outlineWidth: number
}

const COLORS = [
  '#ffffff', '#000000', '#ff0000', '#ffff00', '#00ff00',
  '#0000ff', '#ff00ff', '#F0B429', '#e91e63', '#00bcd4',
]

export default function CustomCreatorPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [topText, setTopText] = useState<TextOverlay>({
    text: '',
    fontSize: 48,
    color: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 3,
  })
  const [bottomText, setBottomText] = useState<TextOverlay>({
    text: '',
    fontSize: 48,
    color: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 3,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    ctx.drawImage(image, 0, 0)

    const drawText = (overlay: TextOverlay, y: number, baseline: CanvasTextBaseline) => {
      if (!overlay.text) return
      ctx.font = `bold ${overlay.fontSize}px Impact, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = baseline
      ctx.fillStyle = overlay.color
      ctx.strokeStyle = overlay.outlineColor
      ctx.lineWidth = overlay.outlineWidth
      ctx.lineJoin = 'round'

      const lines = wrapText(ctx, overlay.text.toUpperCase(), canvas.width * 0.9)
      const lineHeight = overlay.fontSize * 1.15
      let startY = y
      if (baseline === 'bottom') startY = y - (lines.length - 1) * lineHeight

      for (let i = 0; i < lines.length; i++) {
        const ly = startY + i * lineHeight
        ctx.strokeText(lines[i], canvas.width / 2, ly)
        ctx.fillText(lines[i], canvas.width / 2, ly)
      }
    }

    drawText(topText, topText.fontSize * 0.8, 'top')
    drawText(bottomText, canvas.height - bottomText.fontSize * 0.4, 'bottom')

    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText('meme.doaide.com', canvas.width - 10, canvas.height - 6)
  }, [image, topText, bottomText])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = URL.createObjectURL(file)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'custom-meme.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-amber-50 to-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Custom Meme Creator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload any image, add top and bottom text with the classic meme style, and download
            your creation. Free, no login required.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        {!image ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-lg mx-auto block py-20 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-[#F0B429] transition-colors cursor-pointer bg-gray-50"
          >
            <FiUpload className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-lg font-medium text-gray-700">Upload Your Image</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF, or WebP</p>
          </button>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full border border-gray-200 rounded-lg"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer"
                >
                  <FiDownload size={16} />
                  Download Meme
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setTopText((t) => ({ ...t, text: '' }))
                    setBottomText((t) => ({ ...t, text: '' }))
                  }}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer"
                >
                  New Image
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-5 lg:sticky lg:top-20 lg:self-start">
              <h2 className="font-bold text-gray-900">Text Controls</h2>

              <TextControls
                label="Top Text"
                overlay={topText}
                onChange={setTopText}
              />

              <hr className="border-gray-100" />

              <TextControls
                label="Bottom Text"
                overlay={bottomText}
                onChange={setBottomText}
              />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Upload Image</h3>
            <p className="text-sm text-gray-600">Upload any photo or screenshot from your device.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Add Text</h3>
            <p className="text-sm text-gray-600">Type your top and bottom text with Impact font styling.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-[#F0B429]">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Download</h3>
            <p className="text-sm text-gray-600">Download your meme as a high-quality PNG image.</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What image formats are supported?</h3>
            <p className="text-gray-600 text-sm">PNG, JPG, GIF, and WebP images up to 10MB.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Is my image uploaded to a server?</h3>
            <p className="text-gray-600 text-sm">
              No. Everything runs in your browser. Your image never leaves your device.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Can I change the font?</h3>
            <p className="text-gray-600 text-sm">
              The custom creator uses classic Impact font. For more font options, use the{' '}
              <a href="/create" className="text-[#F0B429] hover:underline">full editor</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function TextControls({
  label,
  overlay,
  onChange,
}: {
  label: string
  overlay: TextOverlay
  onChange: (o: TextOverlay) => void
}) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="text"
        placeholder={`Enter ${label.toLowerCase()}...`}
        value={overlay.text}
        onChange={(e) => onChange({ ...overlay, text: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
      />
      <div>
        <label className="block text-xs text-gray-500 mb-1">Size: {overlay.fontSize}px</label>
        <input
          type="range"
          min={16}
          max={120}
          value={overlay.fontSize}
          onChange={(e) => onChange({ ...overlay, fontSize: Number(e.target.value) })}
          className="w-full accent-[#F0B429]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Text Color</label>
        <div className="flex flex-wrap gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...overlay, color: c })}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                overlay.color === c ? 'border-[#F0B429] scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}
