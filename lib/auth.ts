export const COOKIE = 'esraa_auth'
export const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// btoa is available in both Edge and Node runtimes
function sessionToken(): string {
  return btoa((process.env.ADMIN_PASSWORD ?? '') + ':esraa-portfolio')
}

export function signToken(): string {
  return sessionToken()
}

export function verifyToken(token: string): boolean {
  return token === sessionToken()
}
