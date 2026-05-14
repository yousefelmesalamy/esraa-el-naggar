import { SignJWT, jwtVerify } from 'jose'

const COOKIE = 'esraa_auth'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET env var is missing or too short (min 32 chars)')
  }
  return new TextEncoder().encode(jwtSecret)
}

export async function signToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export { COOKIE, MAX_AGE }
