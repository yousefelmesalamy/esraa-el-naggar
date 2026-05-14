'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Category } from '@/lib/types'

const CATEGORIES: Category[] = ['Scriptwriting', 'Criticism', 'Content Writing', 'Research']

export default function UploadPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    category: 'Scriptwriting' as Category,
    description: '',
    date: '',
    externalLink: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  function handleField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!image) { setError('Please select an image'); return }
    setLoading(true)
    setError('')

    const data = new FormData()
    data.append('image', image)
    data.append('title', form.title)
    data.append('category', form.category)
    data.append('description', form.description)
    data.append('date', form.date)
    if (form.externalLink.trim()) data.append('externalLink', form.externalLink.trim())

    try {
      const res = await fetch('/api/works', { method: 'POST', body: data })

      if (res.ok) {
        setSuccess(true)
        setForm({ title: '', category: 'Scriptwriting', description: '', date: '', externalLink: '' })
        setImage(null)
        setPreview(null)
      } else {
        const json = await res.json()
        setError(json.error ?? 'Upload failed')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/admin')
  }

  const inputClass =
    'w-full bg-transparent border-b border-rule focus:border-sepia outline-none py-2 font-serif text-ink text-[14px] placeholder:text-faint transition-colors'
  const labelClass = 'text-[9px] tracking-[3px] uppercase text-sepia'

  return (
    <main className="min-h-screen bg-parchment">
      <header className="flex justify-between items-center px-10 py-5 border-b border-rule">
        <div>
          <h1 className="font-serif text-[18px] text-ink">Upload Work</h1>
          <p className="text-[9px] tracking-[3px] uppercase text-sepia mt-1">Admin · Esraa El-Naggar</p>
        </div>
        <div className="flex gap-6 text-[9px] tracking-[2px] uppercase">
          <Link href="/" className="text-sepia hover:text-ink transition-colors">View Portfolio</Link>
          <button onClick={handleLogout} className="text-faint hover:text-sepia transition-colors">
            Log Out
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-10 py-12">
        {success && (
          <div className="mb-8 py-3 px-4 border border-rule bg-muted/40">
            <p className="font-serif text-[13px] text-ink">Work uploaded successfully.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-1 text-[9px] tracking-[2px] uppercase text-sepia"
            >
              Upload another
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Image */}
          <div>
            <p className={labelClass}>Image *</p>
            <div className="mt-3">
              {preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-sm" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setPreview(null) }}
                    className="absolute top-2 right-2 text-[9px] tracking-[2px] uppercase bg-parchment px-2 py-1 border border-rule text-sepia"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border border-dashed border-rule rounded-sm cursor-pointer hover:border-sepia transition-colors">
                  <span className="text-[9px] tracking-[3px] uppercase text-faint">Choose image</span>
                  <span className="text-[8px] text-faint mt-1">JPG, PNG, WEBP · max 4MB</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="work-title" className={labelClass}>Title *</label>
            <input
              id="work-title"
              type="text"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              placeholder="Work title"
              required
              className={`${inputClass} mt-2`}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="work-category" className={labelClass}>Category *</label>
            <select
              id="work-category"
              required
              value={form.category}
              onChange={(e) => handleField('category', e.target.value)}
              className={`${inputClass} mt-2`}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="work-description" className={labelClass}>Description *</label>
            <textarea
              id="work-description"
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="Short description of this work"
              required
              rows={3}
              className={`${inputClass} mt-2 resize-none`}
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="work-date" className={labelClass}>Date Published *</label>
            <input
              id="work-date"
              type="text"
              value={form.date}
              onChange={(e) => handleField('date', e.target.value)}
              placeholder="e.g. 2024  or  2020–2021"
              required
              className={`${inputClass} mt-2`}
            />
          </div>

          {/* External link */}
          <div>
            <label htmlFor="work-link" className={labelClass}>External Link (optional)</label>
            <input
              id="work-link"
              type="url"
              value={form.externalLink}
              onChange={(e) => handleField('externalLink', e.target.value)}
              placeholder="https://…"
              className={`${inputClass} mt-2`}
            />
          </div>

          {error && (
            <p role="alert" className="text-[10px] tracking-[1px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-[9px] tracking-[3px] uppercase text-sepia border border-rule hover:border-sepia transition-colors py-3 disabled:opacity-40"
          >
            {loading ? 'Uploading…' : 'Publish Work'}
          </button>
        </form>
      </div>
    </main>
  )
}
