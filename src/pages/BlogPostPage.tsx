import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blog-posts'
import { useEffect } from 'react'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} | DoAide Meme Blog`

    let script = document.getElementById('blog-jsonld') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'blog-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
      publisher: { '@type': 'Organization', name: 'DoAide Meme', url: 'https://meme.doaide.com' },
      mainEntityOfPage: `https://meme.doaide.com/blog/${post.slug}`,
    })

    return () => {
      script?.remove()
      document.title = 'DoAide Meme — Free Meme Generator'
    }
  }, [post])

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-500 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-[#F0B429] hover:underline font-medium">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700 no-underline">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link to="/blog" className="text-gray-500 hover:text-gray-700 no-underline">
            Blog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div
          className="prose prose-gray max-w-none
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
            [&_li]:text-gray-700 [&_li]:mb-1
            [&_a]:text-[#F0B429] [&_a]:hover:underline
            [&_strong]:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Ready to create your own memes?
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Browse {40}+ templates, use our AI caption generator, or upload your own image.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/templates"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 no-underline"
              >
                Browse Templates
              </Link>
              <Link
                to="/caption-generator"
                className="bg-[#F0B429] text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#D99E1E] no-underline"
              >
                AI Caption Generator
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
