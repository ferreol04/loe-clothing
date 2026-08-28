import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Input = forwardRef(function Input(
  { label, error, className, id, ...props },
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
      <input
        ref={ref}
        id={id}
        className={cn(
          'rounded-xl border border-border-strong bg-surface px-4 py-3 text-text placeholder:text-text-faint outline-none transition-colors duration-200 focus:border-accent',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
