import { v2 as cloudinary } from 'cloudinary'
import type { Work, Category } from './types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const FOLDER = 'esraa-portfolio'

const VALID_CATEGORIES: readonly Category[] = ['Scriptwriting', 'Criticism', 'Content Writing', 'Research']

// Context keys stored per image
interface CloudinaryContext {
  title: string
  category: Category
  description: string
  date: string
  external_link: string
  created_at: string
}

function resourceToWork(resource: {
  public_id: string
  secure_url: string
  context?: { custom?: CloudinaryContext }
  created_at: string
}): Work {
  const raw = resource.context?.custom ?? ({} as Partial<CloudinaryContext>)
  const decode = (v: string | undefined) => (v ? decodeURIComponent(v) : '')
  const decodedCategory = decode(raw.category)
  return {
    id: resource.public_id,
    title: decode(raw.title) || '',
    category: (VALID_CATEGORIES.includes(decodedCategory as Category) ? decodedCategory : 'Research') as Category,
    description: decode(raw.description) || '',
    date: decode(raw.date) || '',
    imageUrl: resource.secure_url,
    externalLink: raw.external_link ? decodeURIComponent(raw.external_link) : undefined,
    createdAt: decode(raw.created_at) || resource.created_at,
  }
}

export async function listWorks(): Promise<Work[]> {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: FOLDER,
    context: true,
    max_results: 100,
  })
  return (result.resources as Parameters<typeof resourceToWork>[0][])
    .map(resourceToWork)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function uploadWork(
  fileBuffer: Buffer,
  meta: Omit<Work, 'id' | 'imageUrl' | 'createdAt'>,
): Promise<Work> {
  const createdAt = new Date().toISOString()
  const encode = (v: string) => encodeURIComponent(v)
  const contextStr = [
    `title=${encode(meta.title)}`,
    `category=${encode(meta.category)}`,
    `description=${encode(meta.description)}`,
    `date=${encode(meta.date)}`,
    `external_link=${encode(meta.externalLink ?? '')}`,
    `created_at=${encode(createdAt)}`,
  ].join('|')

  const result = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: FOLDER,
            context: contextStr,
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (err, res) => {
            if (err) reject(err)
            else if (!res) reject(new Error('Cloudinary upload returned no result'))
            else resolve(res)
          },
        )
        .end(fileBuffer)
    },
  )

  return {
    id: result.public_id,
    imageUrl: result.secure_url,
    createdAt,
    ...meta,
  }
}

export async function deleteWork(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
