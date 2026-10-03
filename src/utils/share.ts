export async function shareToWhatsApp(blob: Blob): Promise<void> {
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'meme.png', { type: 'image/png' })
    const shareData = { files: [file], title: 'Check out my meme!', text: 'Made with DoAide Meme - meme.doaide.com' }
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData)
      return
    }
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'meme.png'
  link.click()
  URL.revokeObjectURL(url)
}

export function shareToTwitter(text: string): void {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + '\n\nMade with meme.doaide.com')}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function shareNative(blob: Blob): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false
  const file = new File([blob], 'meme.png', { type: 'image/png' })
  const shareData = { files: [file], title: 'My Meme', text: 'Made with DoAide Meme - meme.doaide.com' }
  if (!navigator.canShare(shareData)) return false
  await navigator.share(shareData)
  return true
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
