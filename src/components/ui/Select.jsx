import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full appearance-none rounded-xl border border-border-strong bg-surface px-4 py-3 pr-10 text-text outline-none transition-colors duration-200 focus:border-accent',
            error && 'border-red-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-muted"
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
