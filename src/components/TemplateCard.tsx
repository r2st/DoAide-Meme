import type { MemeTemplate } from '../data/templates'

interface Props {
  template: MemeTemplate
  onClick: (t: MemeTemplate) => void
}

export default function TemplateCard({ template, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(template)}
      className="group rounded-xl overflow-hidden border border-gray-200 hover:border-[#F0B429] hover:shadow-lg transition-all duration-200 cursor-pointer text-left bg-white"
    >
      <div
        className="aspect-square flex items-center justify-center p-4 relative"
        style={{ backgroundColor: template.bgColor }}
      >
        <div className="text-center">
          {template.textPositions.slice(0, 2).map((tp, i) => (
            <p
              key={i}
              className="font-bold text-sm leading-tight mb-1 drop-shadow-sm"
              style={{ color: template.textColor }}
            >
              {tp.defaultText}
            </p>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium shadow">
            Use Template
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">{template.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{template.category}</p>
      </div>
    </button>
  )
}
