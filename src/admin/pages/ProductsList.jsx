import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useAdminProducts } from '../hooks/useAdminProducts'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { currency } from '../../lib/format'
import { supabase } from '../../lib/supabaseClient'
import { cn } from '../../lib/cn'

export function ProductsList() {
  const { products, loading, refetch } = useAdminProducts()
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function toggleFeatured(product) {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !product.is_featured })
      .eq('id', product.id)
    if (error) alert('Erreur : ' + error.message)
    else refetch()
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError('')
    const { error } = await supabase.from('products').delete().eq('id', pendingDelete.id)
    setDeleting(false)

    if (error) {
      setDeleteError('Erreur : ' + error.message)
      return
    }

    setPendingDelete(null)
    refetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-black tracking-tight">Produits</h1>
        <Link to="/admin/produits/nouveau">
          <Button variant="primary" size="sm">
            <Plus size={16} />
            Nouveau produit
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-semibold tracking-wide text-text-faint uppercase">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Vedette</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-surface-hover" />
                      <div className="h-4 w-32 animate-pulse rounded bg-surface-hover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-surface-hover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-surface-hover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-14 animate-pulse rounded-full bg-surface-hover" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-surface-hover" />
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  Aucun produit pour le moment.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                return (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-text">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {currency.format(product.base_price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          product.is_active
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-text-faint/15 text-text-faint',
                        )}
                      >
                        {product.is_active ? 'Actif' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(product)}
                        aria-label={
                          product.is_featured
                            ? 'Retirer de la sélection vedette'
                            : 'Ajouter à la sélection vedette'
                        }
                        aria-pressed={product.is_featured}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                          product.is_featured
                            ? 'text-accent hover:bg-accent/15'
                            : 'text-text-faint hover:bg-surface-hover hover:text-text-muted',
                        )}
                      >
                        <Star size={16} fill={product.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/produits/${product.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                          aria-label="Modifier"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError('')
                            setPendingDelete(product)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer le produit"
        message={
          <>
            Supprimer « {pendingDelete?.name} » ? Cette action est irréversible.
            {deleteError && (
              <span className="mt-2 block text-red-400">{deleteError}</span>
            )}
          </>
        }
        confirmLabel="Supprimer"
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
