import { TriangleAlert } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

/**
 * Modale de confirmation générique (remplace `window.confirm`), cohérente
 * avec le reste du design system.
 */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Confirmer',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = true,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {danger && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <TriangleAlert size={18} />
            </div>
          )}
          <p className="text-sm text-text-muted">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Suppression…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
