import { NextResponse } from 'next/server'
import { listWorks, uploadWork } from '@/lib/cloudinary'
import type { Category } from '@/lib/types'

export async function GET() {
  try {
    const works = await listWorks()
    return NextResponse.json(works)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load works' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('image') as File
    const title = form.get('title') as string
    const category = form.get('category') as Category
    const description = form.get('description') as string
    const date = form.get('date') as string
    const externalLink = (form.get('externalLink') as string) || undefined

    if (!file || !title || !category || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const work = await uploadWork(buffer, { title, category, description, date, externalLink })
    return NextResponse.json(work, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
