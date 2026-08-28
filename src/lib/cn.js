import clsx from 'clsx'

/** Combine des classes conditionnelles (wrapper léger autour de clsx). */
export function cn(...inputs) {
  return clsx(...inputs)
}
