import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCategories } from '../../hooks/useCategories'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabaseClient'
import { slugify } from '../../lib/slugify'

const emptyForm = { id: null, name: '', slug: '', display_order: 1 }

export function CategoriesList() {
  const { categories, loading } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  function handleNameChange(e) {
    const name = e.target.value
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))
  }

  function openCreate() {
    setForm(emptyForm)
    setSlugTouched(false)
    setError('')
    setModalOpen(true)
  }

  function openEdit(cat) {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      display_order: cat.display_order,
    })
    // false : si le nom est modifié, le slug se recalcule automatiquement,
    // comme à la création — jusqu'à ce que le slug soit édité manuellement.
    setSlugTouched(false)
    setError('')
    setModalOpen(true)
  }

  /** Réassigne des positions 1..N contiguës à une liste déjà triée, sans réécrire ce qui n'a pas changé. */
  async function persistOrder(orderedList) {
    const updates = orderedList
      .map((cat, index) => ({ id: cat.id, newOrder: index + 1, changed: cat.display_order !== index + 1 }))
      .filter((u) => u.changed)

    await Promise.all(
      updates.map((u) =>
        supabase.from('categories').update({ display_order: u.newOrder }).eq('id', u.id),
      ),
    )
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError('')
    const { error } = await supabase.from('categories').delete().eq('id', pendingDelete.id)
    setDeleting(false)

    if (error) {
      setDeleteError('Erreur : ' + error.message)
      return
    }
    // Referme le trou laissé dans la numérotation.
    await persistOrder(categories.filter((c) => c.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Le nom et le slug sont requis.')
      return
    }

    setSaving(true)

    // Catégories déjà triées par display_order, hors celle en cours d'édition.
    const others = categories.filter((c) => c.id !== form.id)
    const maxPosition = others.length + 1
    const desiredPosition = Math.min(
      Math.max(1, Number(form.display_order) || 1),
      maxPosition,
    )

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      display_order: desiredPosition,
    }

    const { error } = form.id
      ? await supabase.from('categories').update(payload).eq('id', form.id)
      : await supabase.from('categories').insert(payload)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    // Décale les autres catégories pour libérer/reboucher la position choisie.
    // (La catégorie en cours vient d'être enregistrée à `desiredPosition` ci-dessus ;
    // on l'inclut ici pour que le calcul d'index reste correct, persistOrder l'ignorera
    // automatiquement puisque sa position ne "change" pas.)
    const reordered = [...others]
    reordered.splice(desiredPosition - 1, 0, { id: form.id, display_order: desiredPosition })
    await persistOrder(reordered)

    setSaving(false)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-black tracking-tight">Catégories</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-15 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))
        ) : categories.length === 0 ? (
          <p className="py-8 text-center text-text-muted">
            Aucune catégorie pour le moment.
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="font-medium text-text">{cat.name}</p>
                <p className="text-xs text-text-faint">/{cat.slug}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError('')
                    setPendingDelete(cat)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="cat-name"
            label="Nom"
            value={form.name}
            onChange={handleNameChange}
            required
          />
          <Input
            id="cat-slug"
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setForm((f) => ({ ...f, slug: e.target.value }))
            }}
            required
          />
          <Input
            id="cat-order"
            type="number"
            min="1"
            label="Ordre d'affichage"
            value={form.display_order}
            onChange={(e) => {
              const raw = e.target.value
              // Autorise le champ vide pendant la saisie, sans jamais accepter 0 ou négatif.
              const next = raw === '' ? '' : Math.max(1, Number(raw) || 1)
              setForm((f) => ({ ...f, display_order: next }))
            }}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer la catégorie"
        message={
          <>
            Supprimer la catégorie « {pendingDelete?.name} » ? Cette action est
            irréversible.
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
