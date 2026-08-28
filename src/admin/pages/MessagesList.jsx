import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { generateId } from '../../lib/id'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

export function MessagesList() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`admin-messages-${generateId()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        fetchMessages,
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError('')
    const { error } = await supabase.from('messages').delete().eq('id', pendingDelete)
    setDeleting(false)

    if (error) {
      setDeleteError('Erreur : ' + error.message)
      return
    }

    // Retrait immédiat de l'affichage, sans attendre le round-trip Realtime.
    setMessages((prev) => prev.filter((m) => m.id !== pendingDelete))
    setPendingDelete(null)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-text-muted">
        Avis et suggestions envoyés depuis le formulaire de contact.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))
        ) : messages.length === 0 ? (
          <p className="text-text-muted">Aucun message pour le moment.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-text">{msg.name?.trim() || 'Anonyme'}</p>
                  {msg.email && (
                    <p className="text-xs text-text-faint">{msg.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-text-faint">
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError('')
                      setPendingDelete(msg.id)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-muted">{msg.message}</p>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Supprimer le message"
        message={
          <>
            Supprimer ce message ? Cette action est irréversible.
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
