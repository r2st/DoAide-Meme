import { useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer, Group } from 'react-konva'
import type Konva from 'konva'
import type { MemeTemplate } from '../data/templates'
import type { ImageFilter } from '../utils/canvas'

export interface TextBox {
  id: string
  text: string
  x: number
  y: number
  width: number
  fontSize: number
  fontFamily: string
  fill: string
  stroke: string
  strokeWidth: number
  shadowColor: string
  shadowBlur: number
  opacity: number
  align: 'left' | 'center' | 'right'
  rotation: number
}

export interface StickerItem {
  id: string
  emoji: string
  x: number
  y: number
  fontSize: number
  rotation: number
}

interface Props {
  template: MemeTemplate
  textBoxes: TextBox[]
  stickers: StickerItem[]
  backgroundImage: HTMLImageElement | null
  filters: ImageFilter
  selectedId: string | null
  onSelect: (id: string | null) => void
  onTextChange: (id: string, updates: Partial<TextBox>) => void
  onStickerChange: (id: string, updates: Partial<StickerItem>) => void
  stageRef: React.RefObject<Konva.Stage | null>
  containerWidth: number
}

export default function MemeCanvas({
  template,
  textBoxes,
  stickers,
  backgroundImage,
  filters,
  selectedId,
  onSelect,
  onTextChange,
  onStickerChange,
  stageRef,
  containerWidth,
}: Props) {
  const trRef = useRef<Konva.Transformer>(null)
  const layerRef = useRef<Konva.Layer>(null)

  const scale = Math.min(1, containerWidth / template.width)
  const displayWidth = template.width * scale
  const displayHeight = template.height * scale

  useEffect(() => {
    const tr = trRef.current
    if (!tr || !layerRef.current) return
    if (selectedId) {
      const node = layerRef.current.findOne(`#${selectedId}`)
      if (node) {
        tr.nodes([node])
        tr.getLayer()?.batchDraw()
        return
      }
    }
    tr.nodes([])
    tr.getLayer()?.batchDraw()
  }, [selectedId])

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Rect') {
      onSelect(null)
    }
  }, [onSelect])

  const cssFilter = buildCSSFilter(filters)

  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 inline-block"
      style={{ width: displayWidth, height: displayHeight }}
    >
      <Stage
        ref={stageRef}
        width={displayWidth}
        height={displayHeight}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
      >
        <Layer ref={layerRef}>
          <Rect
            width={template.width}
            height={template.height}
            fill={template.bgColor}
          />

          {backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              width={template.width}
              height={template.height}
              filters={cssFilter ? undefined : undefined}
            />
          )}

          {textBoxes.map((tb) => (
            <Text
              key={tb.id}
              id={tb.id}
              text={tb.text}
              x={tb.x - tb.width / 2}
              y={tb.y - tb.fontSize / 2}
              width={tb.width}
              fontSize={tb.fontSize}
              fontFamily={tb.fontFamily}
              fill={tb.fill}
              stroke={tb.stroke}
              strokeWidth={tb.strokeWidth}
              shadowColor={tb.shadowColor}
              shadowBlur={tb.shadowBlur}
              opacity={tb.opacity}
              align={tb.align}
              draggable
              rotation={tb.rotation}
              wrap="word"
              onClick={() => onSelect(tb.id)}
              onTap={() => onSelect(tb.id)}
              onDragEnd={(e) => {
                const node = e.target
                onTextChange(tb.id, {
                  x: node.x() + tb.width / 2,
                  y: node.y() + tb.fontSize / 2,
                })
              }}
              onTransformEnd={(e) => {
                const node = e.target as Konva.Text
                const scaleX = node.scaleX()
                onTextChange(tb.id, {
                  x: node.x() + (tb.width * scaleX) / 2,
                  y: node.y() + tb.fontSize / 2,
                  width: Math.max(50, tb.width * scaleX),
                  rotation: node.rotation(),
                })
                node.scaleX(1)
                node.scaleY(1)
              }}
            />
          ))}

          {stickers.map((s) => (
            <Text
              key={s.id}
              id={s.id}
              text={s.emoji}
              x={s.x}
              y={s.y}
              fontSize={s.fontSize}
              draggable
              rotation={s.rotation}
              onClick={() => onSelect(s.id)}
              onTap={() => onSelect(s.id)}
              onDragEnd={(e) => {
                onStickerChange(s.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                })
              }}
              onTransformEnd={(e) => {
                const node = e.target
                onStickerChange(s.id, {
                  x: node.x(),
                  y: node.y(),
                  fontSize: Math.max(16, s.fontSize * node.scaleX()),
                  rotation: node.rotation(),
                })
                node.scaleX(1)
                node.scaleY(1)
              }}
            />
          ))}

          {/* Watermark */}
          <Group>
            <Rect
              x={template.width - 145}
              y={template.height - 22}
              width={140}
              height={18}
              fill="rgba(0,0,0,0.3)"
              cornerRadius={3}
            />
            <Text
              text="meme.doaide.com"
              x={template.width - 142}
              y={template.height - 20}
              fontSize={12}
              fontFamily="Inter, sans-serif"
              fill="rgba(255,255,255,0.8)"
              listening={false}
            />
          </Group>

          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 30 || newBox.height < 15) return oldBox
              return newBox
            }}
          />
        </Layer>
      </Stage>
    </div>
  )
}

function buildCSSFilter(f: ImageFilter): string | null {
  const parts: string[] = []
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`)
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`)
  if (f.grayscale > 0) parts.push(`grayscale(${f.grayscale}%)`)
  if (f.sepia > 0) parts.push(`sepia(${f.sepia}%)`)
  if (f.blur > 0) parts.push(`blur(${f.blur}px)`)
  return parts.length ? parts.join(' ') : null
}
