export interface ImageFilter {
  brightness: number
  contrast: number
  grayscale: number
  sepia: number
  blur: number
}

export const DEFAULT_FILTERS: ImageFilter = {
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
}

export function filtersToCSS(f: ImageFilter): string {
  const parts: string[] = []
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`)
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`)
  if (f.grayscale > 0) parts.push(`grayscale(${f.grayscale}%)`)
  if (f.sepia > 0) parts.push(`sepia(${f.sepia}%)`)
  if (f.blur > 0) parts.push(`blur(${f.blur}px)`)
  return parts.length ? parts.join(' ') : 'none'
}
