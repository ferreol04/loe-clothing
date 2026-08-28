import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, LogOut, MessageSquare, Settings, Tags } from 'lucide-react'
import { cn } from '../lib/cn'
import { useAuth } from '../hooks/useAuth'
import { Seo } from '../components/Seo'

const NAV_ITEMS = [
  { to: '/admin/produits', label: 'Produits', icon: LayoutGrid },
  { to: '/admin/categories', label: 'Catégories', icon: Tags },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/parametres', label: 'Infos pratiques', icon: Settings },
]

export function AdminLayout() {
  const { signOut, user } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg">
      <Seo title="Espace admin" noindex />
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
        <p className="px-2 font-display text-lg font-black tracking-tight">
          Admin
        </p>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-text',
                  isActive && 'bg-accent/15 text-accent',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <p className="truncate px-2 text-xs text-text-faint">{user?.email}</p>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-text"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Navigation mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-surface px-2 py-2 lg:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium text-text-muted',
                isActive && 'text-accent',
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={signOut}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium text-text-muted"
        >
          <LogOut size={20} />
          Sortir
        </button>
      </nav>

      <main className="flex-1 overflow-x-hidden p-4 pb-24 sm:p-6 lg:pb-6">
        <Outlet />
      </main>
    </div>
  )
}
