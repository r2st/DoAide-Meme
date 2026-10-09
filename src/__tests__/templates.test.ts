import { describe, it, expect } from 'vitest'
import { templates, CATEGORIES } from '../data/templates'

describe('templates data', () => {
  it('has at least 30 templates', () => {
    expect(templates.length).toBeGreaterThanOrEqual(30)
  })

  it('each template has required fields', () => {
    for (const t of templates) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.category).toBeTruthy()
      expect(t.width).toBeGreaterThan(0)
      expect(t.height).toBeGreaterThan(0)
      expect(t.bgColor).toMatch(/^#/)
      expect(t.textColor).toMatch(/^#/)
      expect(t.textPositions.length).toBeGreaterThan(0)
    }
  })

  it('all template IDs are unique', () => {
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all template categories match CATEGORIES', () => {
    const validCategories = new Set(CATEGORIES.filter((c) => c !== 'All'))
    for (const t of templates) {
      expect(validCategories.has(t.category as any)).toBe(true)
    }
  })

  it('each text position has valid defaults', () => {
    for (const t of templates) {
      for (const tp of t.textPositions) {
        expect(tp.x).toBeGreaterThanOrEqual(0)
        expect(tp.y).toBeGreaterThanOrEqual(0)
        expect(tp.width).toBeGreaterThan(0)
        expect(tp.fontSize).toBeGreaterThan(0)
        expect(['left', 'center', 'right']).toContain(tp.align)
        expect(tp.defaultText).toBeTruthy()
      }
    }
  })
})
