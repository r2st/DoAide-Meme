const RECENT_KEY = 'doaide-meme-recent'
const MAX_RECENT = 20

export interface RecentMeme {
  id: string
  templateId: string
  templateName: string
  thumbnail: string
  createdAt: number
}

export function getRecentMemes(): RecentMeme[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecentMeme(meme: Omit<RecentMeme, 'id' | 'createdAt'>): void {
  try {
    const memes = getRecentMemes()
    const entry: RecentMeme = {
      ...meme,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    memes.unshift(entry)
    if (memes.length > MAX_RECENT) memes.length = MAX_RECENT
    localStorage.setItem(RECENT_KEY, JSON.stringify(memes))
  } catch {
    // localStorage unavailable
  }
}

export function clearRecentMemes(): void {
  try {
    localStorage.removeItem(RECENT_KEY)
  } catch {
    // ignore
  }
}
