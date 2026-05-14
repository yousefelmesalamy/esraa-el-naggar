import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  const valid = token ? await verifyToken(token) : false

  if (!valid) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/upload'],
}
