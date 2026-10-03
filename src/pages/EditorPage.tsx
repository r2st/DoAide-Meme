import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type Konva from 'konva'
import MemeCanvas from '../components/MemeCanvas'
import type { TextBox, StickerItem } from '../components/MemeCanvas'
import EditorToolbar from '../components/EditorToolbar'
import ExportBar from '../components/ExportBar'
import { templates } from '../data/templates'
import type { MemeTemplate } from '../data/templates'
import type { ImageFilter } from '../utils/canvas'
import { DEFAULT_FILTERS } from '../utils/canvas'
import { saveRecentMeme } from '../utils/storage'
import { shareToWhatsApp, shareToTwitter, shareNative, downloadBlob } from '../utils/share'

function createDefaultTextBoxes(template: MemeTemplate): TextBox[] {
  return template.textPositions.map((tp, i) => ({
    id: `text-${i}`,
    text: tp.defaultText,
    x: tp.x,
    y: tp.y,
    width: tp.width,
    fontSize: tp.fontSize,
    fontFamily: 'Impact',
    fill: template.textColor,
    stroke: template.textColor === '#ffffff' ? '#000000' : '#ffffff',
    strokeWidth: 2,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 4,
    opacity: 1,
    align: tp.align,
    rotation: 0,
  }))
}

export default function EditorPage() {
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')

  const template = useMemo(
    () => templates.find((t) => t.id === templateId) || templates[templates.length - 1],
    [templateId]
  )

  const [textBoxes, setTextBoxes] = useState<TextBox[]>(() => createDefaultTextBoxes(template))
  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [filters, setFilters] = useState<ImageFilter>(DEFAULT_FILTERS)
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'filters' | 'stickers'>('text')
  const [containerWidth, setContainerWidth] = useState(600)

  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTextBoxes(createDefaultTextBoxes(template))
    setStickers([])
    setSelectedId(null)
    setBgImage(null)
    setFilters(DEFAULT_FILTERS)
  }, [template])

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const selectedTextBox = useMemo(
    () => textBoxes.find((t) => t.id === selectedId) || null,
    [textBoxes, selectedId]
  )

  const handleTextUpdate = useCallback((updates: Partial<TextBox>) => {
    if (!selectedId) return
    setTextBoxes((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, ...updates } : t))
    )
  }, [selectedId])

  const handleTextChange = useCallback((id: string, updates: Partial<TextBox>) => {
    setTextBoxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const handleStickerChange = useCallback((id: string, updates: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }, [])

  const handleAddText = useCallback(() => {
    const newBox: TextBox = {
      id: `text-${Date.now()}`,
      text: 'New Text',
      x: template.width / 2,
      y: template.height / 2,
      width: 250,
      fontSize: 32,
      fontFamily: 'Impact',
      fill: template.textColor,
      stroke: template.textColor === '#ffffff' ? '#000000' : '#ffffff',
      strokeWidth: 2,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 4,
      opacity: 1,
      align: 'center',
      rotation: 0,
    }
    setTextBoxes((prev) => [...prev, newBox])
    setSelectedId(newBox.id)
  }, [template])

  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return
    setTextBoxes((prev) => prev.filter((t) => t.id !== selectedId))
    setStickers((prev) => prev.filter((s) => s.id !== selectedId))
    setSelectedId(null)
  }, [selectedId])

  const handleImageUpload = useCallback((file: File) => {
    const img = new Image()
    img.onload = () => setBgImage(img)
    img.src = URL.createObjectURL(file)
  }, [])

  const handleAddSticker = useCallback((emoji: string) => {
    const s: StickerItem = {
      id: `sticker-${Date.now()}`,
      emoji,
      x: template.width / 2 - 20 + Math.random() * 40,
      y: template.height / 2 - 20 + Math.random() * 40,
      fontSize: 48,
      rotation: 0,
    }
    setStickers((prev) => [...prev, s])
    setSelectedId(s.id)
  }, [template])

  const getExportBlob = useCallback(async (format: 'png' | 'jpg'): Promise<Blob> => {
    const stage = stageRef.current
    if (!stage) throw new Error('No stage')

    setSelectedId(null)
    await new Promise((r) => setTimeout(r, 50))

    const pixelRatio = 2
    const dataURL = stage.toDataURL({
      pixelRatio,
      mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality: format === 'jpg' ? 0.92 : undefined,
    })

    const resp = await fetch(dataURL)
    return resp.blob()
  }, [])

  const handleDownload = useCallback(async (format: 'png' | 'jpg') => {
    const blob = await getExportBlob(format)
    downloadBlob(blob, `meme.${format}`)

    const thumbURL = stageRef.current?.toDataURL({ pixelRatio: 0.5 }) || ''
    saveRecentMeme({
      templateId: template.id,
      templateName: template.name,
      thumbnail: thumbURL,
    })
  }, [getExportBlob, template])

  const handleShareWhatsApp = useCallback(async () => {
    const blob = await getExportBlob('png')
    await shareToWhatsApp(blob)
  }, [getExportBlob])

  const handleShareTwitter = useCallback(() => {
    shareToTwitter('Check out this meme I made!')
  }, [])

  const handleShareNative = useCallback(async () => {
    const blob = await getExportBlob('png')
    const shared = await shareNative(blob)
    if (!shared) {
      downloadBlob(blob, 'meme.png')
    }
  }, [getExportBlob])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700 no-underline">
            Templates
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{template.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Canvas area */}
          <div className="space-y-4">
            <div ref={containerRef} className="flex justify-center">
              <MemeCanvas
                template={template}
                textBoxes={textBoxes}
                stickers={stickers}
                backgroundImage={bgImage}
                filters={filters}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onTextChange={handleTextChange}
                onStickerChange={handleStickerChange}
                stageRef={stageRef}
                containerWidth={Math.min(containerWidth, 600)}
              />
            </div>

            <ExportBar
              onDownload={handleDownload}
              onShareWhatsApp={handleShareWhatsApp}
              onShareTwitter={handleShareTwitter}
              onShareNative={handleShareNative}
            />
          </div>

          {/* Toolbar sidebar */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <EditorToolbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedTextBox={selectedTextBox}
              onTextUpdate={handleTextUpdate}
              onAddText={handleAddText}
              onDeleteSelected={handleDeleteSelected}
              onImageUpload={handleImageUpload}
              filters={filters}
              onFiltersChange={setFilters}
              onAddSticker={handleAddSticker}
              hasSelection={selectedId !== null}
            />
          </div>
        </div>

        {/* Template switcher */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Try Another Template</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {templates
              .filter((t) => t.id !== template.id)
              .slice(0, 12)
              .map((t) => (
                <Link
                  key={t.id}
                  to={`/create?template=${t.id}`}
                  className="flex-shrink-0 w-28 rounded-lg overflow-hidden border border-gray-200 hover:border-[#F0B429] no-underline bg-white"
                >
                  <div
                    className="aspect-square flex items-center justify-center p-2"
                    style={{ backgroundColor: t.bgColor }}
                  >
                    <p
                      className="text-xs font-bold text-center leading-tight"
                      style={{ color: t.textColor }}
                    >
                      {t.name}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
