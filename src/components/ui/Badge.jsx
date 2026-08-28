import { cn } from '../../lib/cn'

/** Badge pilule avec point lumineux, façon "SÉRIE LIMITÉE" / "TENDANCES". */
export function Badge({ children, dot = true, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase',
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      {children}
    </span>
  )
}
