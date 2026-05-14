import Image from 'next/image'
import type { Work } from '@/lib/types'

export function WorkItem({ work }: { work: Work }) {
  const Wrapper = work.externalLink ? 'a' : 'div'
  const wrapperProps = work.externalLink
    ? { href: work.externalLink, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      className="flex gap-6 items-start py-6 border-b border-muted group cursor-pointer hover:opacity-70 transition-opacity"
    >
      <div className="relative w-24 h-16 shrink-0 overflow-hidden rounded-sm bg-muted">
        <Image
          src={work.imageUrl}
          alt={work.title}
          fill
          className="object-cover"
          sizes="96px"
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
    </Wrapper>
  )
}
