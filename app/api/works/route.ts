import { NextResponse } from 'next/server'
import { listWorks, uploadWork } from '@/lib/cloudinary'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE } from '@/lib/auth'
import { CATEGORIES, type Category } from '@/lib/types'

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
  const token = (await cookies()).get(COOKIE)?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await req.formData()

    const file = form.get('image')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'image must be a file' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'image must be an image file' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'image must be under 10MB' }, { status: 400 })
    }

    const title = form.get('title')
    const category = form.get('category')
    const description = form.get('description')
    const date = form.get('date')
    const externalLink = form.get('externalLink')

    if (
      typeof title !== 'string' || !title.trim() ||
      typeof category !== 'string' || !category.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof date !== 'string' || !date.trim()
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!CATEGORIES.includes(category as Category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const work = await uploadWork(buffer, {
      title: title.trim(),
      category: category as Category,
      description: description.trim(),
      date: date.trim(),
      externalLink: typeof externalLink === 'string' && externalLink.trim() ? externalLink.trim() : undefined,
    })
    return NextResponse.json(work, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
