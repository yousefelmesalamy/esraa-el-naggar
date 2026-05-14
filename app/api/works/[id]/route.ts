import { NextResponse } from 'next/server'
import { deleteWork } from '@/lib/cloudinary'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    // Cloudinary public_id may include slashes (folder/name) — decode it
    await deleteWork(decodeURIComponent(id))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
