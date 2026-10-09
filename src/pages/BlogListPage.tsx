import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog-posts'

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-amber-50 to-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            DoAide Meme Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tips, guides, and insights on meme culture, meme marketing, and creating memes
            that people actually share.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F0B429] hover:shadow-md transition-all no-underline group"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
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
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#F0B429] transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
