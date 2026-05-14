import type { Work } from '@/lib/types'

interface Props {
  work: Work
  onClick: () => void
}

export function WorkItem({ work, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex gap-6 items-start py-6 border-b border-muted cursor-pointer hover:opacity-70 transition-opacity"
    >
      <div className="w-24 h-16 shrink-0 overflow-hidden rounded-sm bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.imageUrl}
          alt={work.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] tracking-[3px] uppercase text-sepia mb-1">
          {work.category}
        </p>
        <h2 className="font-serif text-[15px] text-ink leading-snug mb-1">
          {work.title}
        </h2>
        <p className="font-serif text-[11px] text-sepia leading-relaxed line-clamp-2">
          {work.description}
        </p>
        <p className="text-[9px] tracking-[2px] uppercase text-faint mt-1">
          {work.date}
        </p>
      </div>

      {work.externalLink && (
        <span className="text-faint text-sm self-center shrink-0">↗</span>
      )}
    </div>
  )
}
