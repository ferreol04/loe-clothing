import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text transition-colors duration-200 hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200',
              p === page
                ? 'bg-accent text-bg'
                : 'text-text-muted hover:bg-surface-hover hover:text-text',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-text transition-colors duration-200 hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
