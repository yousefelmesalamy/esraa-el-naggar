import { SignJWT, jwtVerify } from 'jose'

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET env var is missing or too short (min 32 chars)')
}
const SECRET = new TextEncoder().encode(jwtSecret)
const COOKIE = 'esraa_auth'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function signToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export { COOKIE, MAX_AGE }
