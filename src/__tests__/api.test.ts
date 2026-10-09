import { describe, it, expect, vi } from 'vitest'
import { generateCaptions } from '../utils/api'

describe('generateCaptions', () => {
  it('sends correct request shape', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        captions: [
          { top: 'When you code', bottom: 'And it works' },
          { top: 'Monday morning', bottom: 'Meeting time' },
        ],
      }),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await generateCaptions('coding life', 'Drake', 'Funny')

    expect(mockFetch).toHaveBeenCalledWith('/api/generate-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'coding life', template: 'Drake', tone: 'Funny' }),
    })
    expect(result).toHaveLength(2)
    expect(result[0].top).toBe('When you code')

    vi.unstubAllGlobals()
  })

  it('throws on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Rate limited' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(generateCaptions('test')).rejects.toThrow('Rate limited')

    vi.unstubAllGlobals()
  })
})
