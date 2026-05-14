'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/upload')
      } else {
        setError('Incorrect password')
        setLoading(false)
      }
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <h1 className="font-serif text-[22px] text-ink mb-1">Admin</h1>
        <p className="text-[9px] tracking-[3px] uppercase text-sepia mb-8">
          Esraa El-Naggar · Portfolio
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="admin-password" className="sr-only">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-transparent border-b border-rule focus:border-sepia outline-none py-2 font-serif text-ink text-[14px] placeholder:text-faint transition-colors"
          />

          {error && (
            <p role="alert" className="text-[10px] tracking-[1px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 text-[9px] tracking-[3px] uppercase text-sepia border border-rule hover:border-sepia transition-colors py-2 disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <Link
          href="/"
          className="block mt-8 text-[9px] tracking-[2px] uppercase text-faint hover:text-sepia transition-colors"
        >
          ← Back to portfolio
        </Link>
      </div>
    </main>
  )
}
