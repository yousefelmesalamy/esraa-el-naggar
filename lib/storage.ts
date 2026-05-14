import { put, del, head } from '@vercel/blob'
import type { Work, Category } from './types'

const WORKS_KEY = 'esraa-portfolio/works.json'

// ── internal helpers ───────────────────────────────────────────────────────

async function readWorks(): Promise<Work[]> {
  try {
    const blob = await head(WORKS_KEY)
    if (!blob) return []
    const res = await fetch(blob.url, { cache: 'no-store' })
    return (await res.json()) as Work[]
  } catch {
    return []
  }
}

async function writeWorks(works: Work[]): Promise<void> {
  await put(WORKS_KEY, JSON.stringify(works), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

// ── public API ─────────────────────────────────────────────────────────────

export async function listWorks(): Promise<Work[]> {
  const works = await readWorks()
  return works.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function uploadWork(
  fileBuffer: Buffer,
  filename: string,
  meta: Omit<Work, 'id' | 'imageUrl' | 'createdAt'>,
): Promise<Work> {
  const createdAt = new Date().toISOString()
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const blobPath = `esraa-portfolio/images/${Date.now()}-${safeName}`

  const blob = await put(blobPath, fileBuffer, { access: 'public', addRandomSuffix: true })

  const work: Work = {
    id: blob.url,
    imageUrl: blob.url,
    createdAt,
    ...meta,
  }

  const works = await readWorks()
  works.push(work)
  await writeWorks(works)

  return work
}

export async function deleteWork(id: string): Promise<void> {
  await del(id)
  const works = await readWorks()
  await writeWorks(works.filter((w) => w.id !== id))
}
