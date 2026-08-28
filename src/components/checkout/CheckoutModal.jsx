import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, MapPin, Loader2, Store, Truck } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useCartStore } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'
import { useGeolocation } from '../../hooks/useGeolocation'
import { buildOrderMessage, buildWhatsAppLink, buildMapsLink } from '../../lib/whatsapp'
import { cn } from '../../lib/cn'

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function CheckoutModal({ open, onClose }) {
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const clearCart = useCartStore((state) => state.clearCart)
  const { settings, loading: settingsLoading } = useSettings()
  const geolocation = useGeolocation()

  const [step, setStep] = useState('mode') // 'mode' | 'details'
  const [mode, setMode] = useState(null) // 'delivery' | 'pickup'
  const [phone, setPhone] = useState('')
  const [locationMethod, setLocationMethod] = useState('gps') // 'gps' | 'manual'
  const [manualAddress, setManualAddress] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const whatsappNotConfigured = !settingsLoading && !settings?.whatsapp_number
  const unavailableMessage = settings?.phone
    ? `Aucun numéro de réception des commandes n'est disponible pour le moment. Merci de contacter la boutique au ${settings.phone} pour signaler le problème.`
    : "Aucun numéro de réception des commandes n'est disponible pour le moment. Merci de contacter la boutique pour signaler le problème."

  function resetAndClose() {
    setStep('mode')
    setMode(null)
    setPhone('')
    setLocationMethod('gps')
    setManualAddress('')
    setPhoneError('')
    setSubmitError('')
    geolocation.reset()
    onClose()
  }

  function selectMode(nextMode) {
    setMode(nextMode)
    setStep('details')
  }

  function handleBack() {
    setStep('mode')
  }

  const needsManualAddress =
    mode === 'delivery' &&
    (locationMethod === 'manual' || geolocation.status === 'error')
  const canSubmit =
    phone.trim().length >= 8 &&
    (mode === 'pickup' ||
      (locationMethod === 'gps' && geolocation.status === 'success') ||
      (needsManualAddress && manualAddress.trim().length > 4))

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    if (phone.trim().length < 8) {
      setPhoneError('Merci de renseigner un numéro de téléphone valide.')
      return
    }
    if (!canSubmit) return

    if (!settings?.whatsapp_number) {
      setSubmitError(unavailableMessage)
      return
    }

    const message = buildOrderMessage({
      items,
      total: totalPrice,
      mode,
      phone: phone.trim(),
      mapsLink:
        mode === 'delivery' && locationMethod === 'gps' && geolocation.coords
          ? buildMapsLink(geolocation.coords.latitude, geolocation.coords.longitude)
          : undefined,
      locationText: needsManualAddress ? manualAddress.trim() : undefined,
    })

    const link = buildWhatsAppLink(settings.whatsapp_number, message)
    window.open(link, '_blank', 'noopener,noreferrer')
    clearCart()
    resetAndClose()
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={step === 'mode' ? 'Comment souhaitez-vous être servi ?' : undefined}
    >
      <AnimatePresence mode="wait">
        {step === 'mode' ? (
          <motion.div
            key="mode"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            <button
              type="button"
              onClick={() => selectMode('delivery')}
              className="flex items-center gap-4 rounded-2xl border border-border-strong p-5 text-left transition-colors duration-200 hover:border-accent"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Truck size={22} />
              </div>
              <div>
                <p className="font-semibold text-text">Livraison</p>
                <p className="mt-0.5 text-sm text-text-muted">
                  On vous livre à l'adresse de votre choix
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectMode('pickup')}
              className="flex items-center gap-4 rounded-2xl border border-border-strong p-5 text-left transition-colors duration-200 hover:border-accent"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Store size={22} />
              </div>
              <div>
                <p className="font-semibold text-text">Retrait en boutique</p>
                <p className="mt-0.5 text-sm text-text-muted">
                  On vous prévient dès que c'est prêt
                </p>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="details"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 self-start text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              <ChevronLeft size={16} />
              Changer de mode
            </button>

            <h2 className="font-display text-lg font-bold">
              {mode === 'delivery' ? 'Livraison' : 'Retrait en boutique'}
            </h2>

            {whatsappNotConfigured && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {unavailableMessage}
              </p>
            )}

            <Input
              id="checkout-phone"
              label="Numéro de téléphone"
              type="tel"
              placeholder="+229 01 XX XX XX XX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setPhoneError('')
              }}
              error={phoneError}
              required
            />

            {mode === 'delivery' && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLocationMethod('gps')}
                    className={cn(
                      'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                      locationMethod === 'gps'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border-strong text-text-muted hover:border-accent',
                    )}
                  >
                    Partager ma position
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMethod('manual')}
                    className={cn(
                      'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                      locationMethod === 'manual'
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border-strong text-text-muted hover:border-accent',
                    )}
                  >
                    Saisir une adresse
                  </button>
                </div>

                {locationMethod === 'gps' ? (
                  <div className="rounded-xl border border-border-strong p-4">
                    {geolocation.status === 'idle' && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={geolocation.requestLocation}
                        className="w-full"
                      >
                        <MapPin size={16} />
                        Partager ma position GPS
                      </Button>
                    )}
                    {geolocation.status === 'loading' && (
                      <p className="flex items-center justify-center gap-2 text-sm text-text-muted">
                        <Loader2 size={16} className="animate-spin" />
                        Récupération de votre position…
                      </p>
                    )}
                    {geolocation.status === 'success' && (
                      <p className="flex items-center gap-2 text-sm text-emerald-400">
                        <MapPin size={16} />
                        Position récupérée avec succès
                      </p>
                    )}
                    {geolocation.status === 'error' && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-red-400">{geolocation.error}</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={geolocation.requestLocation}
                        >
                          Réessayer
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="manual-address"
                      className="text-sm font-medium text-text-muted"
                    >
                      Adresse de livraison
                    </label>
                    <textarea
                      id="manual-address"
                      rows={3}
                      placeholder="Quartier, rue, repère…"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="resize-none rounded-xl border border-border-strong bg-bg px-4 py-3 text-text outline-none transition-colors duration-200 placeholder:text-text-faint focus:border-accent"
                    />
                  </div>
                )}
              </div>
            )}

            {submitError && (
              <p className="text-sm text-red-400">{submitError}</p>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={!canSubmit || whatsappNotConfigured}
            >
              Envoyer la commande sur WhatsApp
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  )
}
