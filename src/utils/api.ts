export interface Caption {
  top: string
  bottom: string
}

export async function generateCaptions(
  topic: string,
  template?: string,
  tone?: string
): Promise<Caption[]> {
  const res = await fetch('/api/generate-caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, template, tone }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Failed to generate captions')
  }
  const data = await res.json()
  return data.captions || []
}
