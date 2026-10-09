import { describe, it, expect } from 'vitest'
import { blogPosts } from '../data/blog-posts'

describe('blog posts data', () => {
  it('has at least 2 blog posts', () => {
    expect(blogPosts.length).toBeGreaterThanOrEqual(2)
  })

  it('all slugs are unique', () => {
    const slugs = blogPosts.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('each post has required fields', () => {
    for (const post of blogPosts) {
      expect(post.slug).toBeTruthy()
      expect(post.slug).toMatch(/^[a-z0-9-]+$/)
      expect(post.title.length).toBeGreaterThan(10)
      expect(post.description.length).toBeGreaterThan(20)
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.readTime).toBeTruthy()
      expect(post.content.length).toBeGreaterThan(100)
    }
  })

  it('blog post dates are valid', () => {
    for (const post of blogPosts) {
      const date = new Date(post.date)
      expect(date.toString()).not.toBe('Invalid Date')
    }
  })

  it('blog post content contains HTML', () => {
    for (const post of blogPosts) {
      expect(post.content).toContain('<')
      expect(post.content).toContain('<h2>')
      expect(post.content).toContain('<p>')
    }
  })
})
