import { describe, it, expect } from 'vitest'

const ROUTES = [
  '/',
  '/templates',
  '/custom-meme-creator',
  '/caption-generator',
  '/create',
  '/blog',
  '/blog/how-to-make-memes-that-go-viral',
  '/blog/best-meme-templates-2026',
  '/blog/meme-marketing-guide-for-brands',
]

const SITEMAP_URLS = [
  'https://meme.doaide.com/',
  'https://meme.doaide.com/templates',
  'https://meme.doaide.com/custom-meme-creator',
  'https://meme.doaide.com/caption-generator',
  'https://meme.doaide.com/create',
  'https://meme.doaide.com/blog',
  'https://meme.doaide.com/blog/how-to-make-memes-that-go-viral',
  'https://meme.doaide.com/blog/best-meme-templates-2026',
  'https://meme.doaide.com/blog/meme-marketing-guide-for-brands',
]

describe('routes', () => {
  it('all expected routes are defined', () => {
    expect(ROUTES.length).toBeGreaterThanOrEqual(9)
  })

  it('routes start with /', () => {
    for (const route of ROUTES) {
      expect(route.startsWith('/')).toBe(true)
    }
  })
})

describe('sitemap', () => {
  it('has all required URLs', () => {
    expect(SITEMAP_URLS.length).toBeGreaterThanOrEqual(9)
    for (const url of SITEMAP_URLS) {
      expect(url.startsWith('https://meme.doaide.com')).toBe(true)
    }
  })
})
