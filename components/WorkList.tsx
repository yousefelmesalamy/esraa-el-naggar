'use client'
import { useState } from 'react'
import { WorkItem } from './WorkItem'
import { FilterBar, type Filter } from './FilterBar'
import type { Work } from '@/lib/types'

export function WorkList({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const visible = filter === 'All'
    ? works
    : works.filter((w) => w.category === filter)

  return (
    <div>
      <FilterBar active={filter} onChange={setFilter} />
      <div className="px-10">
        {visible.length === 0 && (
          <p className="py-16 text-center font-serif text-sepia text-sm">
            No works in this category yet.
          </p>
        )}
        {visible.map((w) => (
          <WorkItem key={w.id} work={w} />
        ))}
      </div>
    </div>
  )
}
