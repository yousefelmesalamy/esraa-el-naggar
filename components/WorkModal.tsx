'use client'
import { useEffect } from 'react'
import type { Work } from '@/lib/types'

export function WorkModal({ work, onClose }: { work: Work; onClose: () => void }) {
  // close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-parchment max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="w-full aspect-video overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.imageUrl}
            alt={work.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-8 py-7">
          <div className="flex justify-between items-start mb-5">
            <p className="text-[9px] tracking-[3px] uppercase text-sepia">
              {work.category}
            </p>
            <button
              onClick={onClose}
              className="text-[9px] tracking-[2px] uppercase text-faint hover:text-sepia transition-colors"
            >
              Close ✕
            </button>
          </div>

          <h2 className="font-serif text-[22px] text-ink leading-snug mb-3">
            {work.title}
          </h2>

          <p className="font-serif text-[13px] text-sepia leading-relaxed mb-5">
            {work.description}
          </p>

          <div className="flex justify-between items-center border-t border-rule pt-4">
            <p className="text-[9px] tracking-[2px] uppercase text-faint">
              {work.date}
            </p>
            {work.externalLink && (
              <a
                href={work.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] tracking-[2px] uppercase text-sepia border border-rule hover:border-sepia transition-colors px-3 py-1.5"
              >
                Open Link ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
