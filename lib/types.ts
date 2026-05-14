export type Category =
  | 'Scriptwriting'
  | 'Criticism'
  | 'Content Writing'
  | 'Research'

export const CATEGORIES: readonly Category[] = [
  'Scriptwriting',
  'Criticism',
  'Content Writing',
  'Research',
]

export interface Work {
  id: string          // Cloudinary public_id
  title: string
  category: Category
  description: string
  date: string        // e.g. "2024" or "2020–2021"
  imageUrl: string    // Cloudinary optimized URL
  externalLink?: string
  createdAt: string   // ISO string for sorting
}
