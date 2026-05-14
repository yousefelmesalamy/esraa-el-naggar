import { v2 as cloudinary } from 'cloudinary'
import type { Work, Category } from './types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const FOLDER = 'esraa-portfolio'

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
  const ctx = resource.context?.custom ?? ({} as Partial<CloudinaryContext>)
  return {
    id: resource.public_id,
    title: ctx.title ?? '',
    category: (ctx.category as Category) ?? 'Research',
    description: ctx.description ?? '',
    date: ctx.date ?? '',
    imageUrl: resource.secure_url,
    externalLink: ctx.external_link || undefined,
    createdAt: ctx.created_at ?? resource.created_at,
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
  const contextStr = [
    `title=${meta.title}`,
    `category=${meta.category}`,
    `description=${meta.description}`,
    `date=${meta.date}`,
    `external_link=${meta.externalLink ?? ''}`,
    `created_at=${createdAt}`,
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
            if (err || !res) reject(err)
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
