import { FiType, FiImage, FiSliders, FiSmile, FiTrash2 } from 'react-icons/fi'
import type { TextBox } from './MemeCanvas'
import type { ImageFilter } from '../utils/canvas'
import { DEFAULT_FILTERS } from '../utils/canvas'
import { STICKERS } from '../data/templates'

type Tab = 'text' | 'image' | 'filters' | 'stickers'

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  selectedTextBox: TextBox | null
  onTextUpdate: (updates: Partial<TextBox>) => void
  onAddText: () => void
  onDeleteSelected: () => void
  onImageUpload: (file: File) => void
  filters: ImageFilter
  onFiltersChange: (f: ImageFilter) => void
  onAddSticker: (emoji: string) => void
  hasSelection: boolean
}

const FONTS = [
  'Impact',
  'Arial Black',
  'Comic Sans MS',
  'Inter',
  'Georgia',
  'Courier New',
  'Trebuchet MS',
  'Verdana',
]

const COLORS = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#F0B429', '#ff6b35',
  '#e91e63', '#9c27b0', '#4caf50', '#2196f3', '#795548',
]

export default function EditorToolbar({
  activeTab,
  onTabChange,
  selectedTextBox,
  onTextUpdate,
  onAddText,
  onDeleteSelected,
  onImageUpload,
  filters,
  onFiltersChange,
  onAddSticker,
  hasSelection,
}: Props) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'text', icon: <FiType size={18} />, label: 'Text' },
    { id: 'image', icon: <FiImage size={18} />, label: 'Image' },
    { id: 'filters', icon: <FiSliders size={18} />, label: 'Filters' },
    { id: 'stickers', icon: <FiSmile size={18} />, label: 'Stickers' },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'text-[#F0B429] border-b-2 border-[#F0B429] bg-amber-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {activeTab === 'text' && (
          <TextPanel
            selectedTextBox={selectedTextBox}
            onTextUpdate={onTextUpdate}
            onAddText={onAddText}
            onDeleteSelected={onDeleteSelected}
            hasSelection={hasSelection}
          />
        )}
        {activeTab === 'image' && (
          <ImagePanel onImageUpload={onImageUpload} />
        )}
        {activeTab === 'filters' && (
          <FiltersPanel filters={filters} onFiltersChange={onFiltersChange} />
        )}
        {activeTab === 'stickers' && (
          <StickersPanel onAddSticker={onAddSticker} />
        )}
      </div>
    </div>
  )
}

function TextPanel({
  selectedTextBox,
  onTextUpdate,
  onAddText,
  onDeleteSelected,
  hasSelection,
}: {
  selectedTextBox: TextBox | null
  onTextUpdate: (u: Partial<TextBox>) => void
  onAddText: () => void
  onDeleteSelected: () => void
  hasSelection: boolean
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onAddText}
        className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer"
      >
        + Add Text Box
      </button>

      {hasSelection && (
        <button
          type="button"
          onClick={onDeleteSelected}
          className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FiTrash2 size={14} />
          Delete Selected
        </button>
      )}

      {selectedTextBox && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Text</label>
            <textarea
              value={selectedTextBox.text}
              onChange={(e) => onTextUpdate({ text: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
            <select
              value={selectedTextBox.fontFamily}
              onChange={(e) => onTextUpdate({ fontFamily: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B429]"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Size: {selectedTextBox.fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={80}
              value={selectedTextBox.fontSize}
              onChange={(e) => onTextUpdate({ fontSize: Number(e.target.value) })}
              className="w-full accent-[#F0B429]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onTextUpdate({ fill: c })}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                    selectedTextBox.fill === c ? 'border-[#F0B429] scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Outline Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onTextUpdate({ stroke: c })}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                    selectedTextBox.stroke === c ? 'border-[#F0B429] scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Outline Width: {selectedTextBox.strokeWidth}
            </label>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={selectedTextBox.strokeWidth}
              onChange={(e) => onTextUpdate({ strokeWidth: Number(e.target.value) })}
              className="w-full accent-[#F0B429]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Shadow: {selectedTextBox.shadowBlur}
            </label>
            <input
              type="range"
              min={0}
              max={20}
              value={selectedTextBox.shadowBlur}
              onChange={(e) => onTextUpdate({ shadowBlur: Number(e.target.value) })}
              className="w-full accent-[#F0B429]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Opacity: {Math.round(selectedTextBox.opacity * 100)}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={selectedTextBox.opacity * 100}
              onChange={(e) => onTextUpdate({ opacity: Number(e.target.value) / 100 })}
              className="w-full accent-[#F0B429]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => onTextUpdate({ align: a })}
                  className={`flex-1 py-1.5 rounded text-xs font-medium cursor-pointer ${
                    selectedTextBox.align === a
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedTextBox && !hasSelection && (
        <p className="text-xs text-gray-400 text-center py-4">
          Click a text box on the canvas to edit it, or add a new one above.
        </p>
      )}
    </div>
  )
}

function ImagePanel({ onImageUpload }: { onImageUpload: (f: File) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Upload your own image as the meme background.</p>
      <label className="block w-full py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#F0B429] transition-colors">
        <FiImage className="mx-auto mb-2 text-gray-400" size={32} />
        <span className="text-sm text-gray-500">Click to upload image</span>
        <span className="block text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImageUpload(file)
          }}
        />
      </label>
    </div>
  )
}

function FiltersPanel({
  filters,
  onFiltersChange,
}: {
  filters: ImageFilter
  onFiltersChange: (f: ImageFilter) => void
}) {
  const sliders: { key: keyof ImageFilter; label: string; min: number; max: number; unit: string }[] = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
    { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px' },
  ]

  return (
    <div className="space-y-4">
      {sliders.map((s) => (
        <div key={s.key}>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {s.label}: {filters[s.key]}{s.unit}
          </label>
          <input
            type="range"
            min={s.min}
            max={s.max}
            value={filters[s.key]}
            onChange={(e) => onFiltersChange({ ...filters, [s.key]: Number(e.target.value) })}
            className="w-full accent-[#F0B429]"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onFiltersChange(DEFAULT_FILTERS)}
        className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  )
}

function StickersPanel({ onAddSticker }: { onAddSticker: (emoji: string) => void }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">Tap a sticker to add it to your meme. Drag to reposition.</p>
      <div className="grid grid-cols-6 gap-2">
        {STICKERS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onAddSticker(emoji)}
            className="aspect-square flex items-center justify-center text-2xl rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
