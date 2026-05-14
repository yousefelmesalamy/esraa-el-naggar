import Link from 'next/link'
import { WorkList } from '@/components/WorkList'
import { listWorks } from '@/lib/storage'
export const revalidate = 0 // always fetch fresh data

export default async function PortfolioPage() {
  const works = await listWorks()

  return (
    <main>
      {/* Header */}
      <header className="flex justify-between items-baseline px-10 py-5 border-b border-rule">
        <div>
          <h1 className="font-serif text-[18px] text-ink">Esraa El-Naggar</h1>
          <p className="text-[9px] tracking-[3px] uppercase text-sepia mt-1">
            Writer · Critic · Researcher
          </p>
        </div>
        <nav className="flex gap-6 text-[10px] tracking-[2px] uppercase text-sepia">
          <Link href="/" className="hover:text-ink transition-colors">Work</Link>
          <Link href="#about" className="hover:text-ink transition-colors">About</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-10 py-9 border-b border-rule">
        <p className="text-[9px] tracking-[4px] uppercase text-sepia mb-3">
          Selected Work
        </p>
        <p className="font-serif text-[28px] text-ink leading-snug max-w-xl">
          Eleven years of writing,<br />criticism, and audiovisual research.
        </p>
      </section>

      {/* Filtered work list */}
      <WorkList works={works} />

      {/* About anchor */}
      <section id="about" className="px-10 py-12 border-t border-rule mt-4">
        <p className="text-[9px] tracking-[4px] uppercase text-sepia mb-4">About</p>
        <p className="font-serif text-[15px] text-ink leading-relaxed max-w-xl">
          Detail-oriented writer and researcher with over eleven years of
          experience in content writing, scriptwriting and audiovisual art
          criticism. Currently an MA researcher at the Department of Cinematic
          and TV Criticism, Academy of Arts.
        </p>
        <p className="mt-4 text-[9px] tracking-[2px] uppercase text-sepia">
          esraa.elnagar38@gmail.com
        </p>
      </section>

      {/* Footer */}
      <footer className="px-10 py-5 border-t border-rule flex justify-between items-center">
        <span className="text-[9px] tracking-[2px] text-faint">© {new Date().getFullYear()} Esraa El-Naggar</span>
        <Link href="/admin" className="text-[9px] tracking-[2px] text-rule hover:text-sepia transition-colors">Admin</Link>
      </footer>
    </main>
  )
}
