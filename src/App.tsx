import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import TemplatesPage from './pages/TemplatesPage'
import CustomCreatorPage from './pages/CustomCreatorPage'
import CaptionGeneratorPage from './pages/CaptionGeneratorPage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<EditorPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/custom-meme-creator" element={<CustomCreatorPage />} />
            <Route path="/caption-generator" element={<CaptionGeneratorPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
