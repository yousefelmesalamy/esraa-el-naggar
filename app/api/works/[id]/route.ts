import { NextResponse } from 'next/server'
import { deleteWork } from '@/lib/storage'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE } from '@/lib/auth'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
