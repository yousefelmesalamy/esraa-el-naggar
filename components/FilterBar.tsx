'use client'
import type { Category } from '@/lib/types'

const ALL = 'All'
type Filter = Category | typeof ALL

const CATEGORIES: Filter[] = [ALL, 'Scriptwriting', 'Criticism', 'Content Writing', 'Research']

interface FilterBarProps {
  active: Filter
  onChange: (f: Filter) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-3 items-center px-10 py-3 border-b border-rule flex-wrap">
      <span className="text-[9px] tracking-[3px] uppercase text-sepia">Filter</span>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-[9px] tracking-[2px] uppercase px-2 py-1 border rounded-sm transition-colors ${
            active === cat
              ? 'border-sepia text-sepia'
              : 'border-rule text-faint hover:border-sepia hover:text-sepia'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export type { Filter }
