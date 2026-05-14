import { NextResponse } from 'next/server'
import { timingSafeEqual, createHash } from 'crypto'
import { signToken, COOKIE, MAX_AGE } from '@/lib/auth'

export async function POST(req: Request) {
  let password: string
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const expected = process.env.ADMIN_PASSWORD ?? ''
  const a = createHash('sha256').update(password).digest()
  const b = createHash('sha256').update(expected).digest()

  if (!timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await signToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
  return res
}
