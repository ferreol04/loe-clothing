import { useEffect, useState } from 'react'
import { generateId } from '../../lib/id'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { useCategories } from '../../hooks/useCategories'
import { supabase } from '../../lib/supabaseClient'
import { slugify } from '../../lib/slugify'
import { uploadProductImage, deleteProductImage } from '../../lib/storage'

const emptyVariant = () => ({
  id: generateId(),
  size: '',
  price: '',
  sku: '',
})

export function ProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id) && id !== 'nouveau'
  const navigate = useNavigate()
  const { categories } = useCategories()

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([emptyVariant()])

  useEffect(() => {
    if (!isEditing) return

    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .eq('id', id)
        .single()

      if (error) {
        setError('Produit introuvable.')
        setLoading(false)
        return
      }

      setName(data.name)
      setSlug(data.slug)
      setCategoryId(data.category_id ?? '')
      setDescription(data.description ?? '')
      setBasePrice(String(data.base_price))
      setIsActive(data.is_active)
      setIsFeatured(data.is_featured ?? false)
      setImages(data.images ?? [])
      setVariants(
        data.variants.length
          ? data.variants.map((v) => ({
              id: v.id,
              size: v.size ?? '',
              price: v.price != null ? String(v.price) : '',
              sku: v.sku ?? '',
            }))
          : [emptyVariant()],
      )
      setLoading(false)
    }

    fetchProduct()
  }, [id, isEditing])

  function handleNameChange(e) {
    const nextName = e.target.value
    setName(nextName)
    if (!slugTouched) setSlug(slugify(nextName))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      const previous = images[0]
      setImages([url])
      if (previous) deleteProductImage(previous).catch(() => {})
    } catch (err) {
      alert("Erreur lors de l'envoi de l'image : " + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleRemoveImage(url) {
    setImages([])
    deleteProductImage(url).catch(() => {})
  }

  function updateVariant(variantId, patch) {
    setVariants((prev) => prev.map((v) => (v.id === variantId ? { ...v, ...patch } : v)))
  }

  function addVariant() {
    setVariants((prev) => [...prev, emptyVariant()])
  }

  function removeVariant(variantId) {
    setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== variantId) : prev))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !slug.trim() || !basePrice || !categoryId) {
      setError('Merci de renseigner au moins le nom, le slug, la catégorie et le prix.')
      return
    }

    setSaving(true)

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      category_id: categoryId || null,
      description: description.trim() || null,
      base_price: Number(basePrice),
      is_active: isActive,
      is_featured: isFeatured,
      images,
    }

    let productId = id
    
    if (isEditing) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(payload)
        .select('id')
        .single()
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      productId = data.id
    }

    // Remplace les variantes existantes par l'état courant du formulaire.
    await supabase.from('product_variants').delete().eq('product_id', productId)
    let variantsPayload = variants
      .filter((v) => v.size.trim() !== '' || v.price.trim() !== '')
      .map((v) => ({
        product_id: productId,
        size: v.size || null,
        price: v.price ? Number(v.price) : null,
        // Stock non géré depuis l'admin : la disponibilité se pilote en
        // masquant/supprimant le produit ou la variante concernée.
        stock: null,
        sku: v.sku || null,
      }))

    // Un produit sans taille (accessoire, etc.) doit rester achetable :
    // on lui garantit toujours au moins une variante « unique ».
    if (variantsPayload.length === 0) {
      variantsPayload = [
        { product_id: productId, size: null, price: null, stock: null, sku: null },
      ]
    }

    if (variantsPayload.length) {
      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variantsPayload)
      if (variantsError) {
        setError(variantsError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    navigate('/admin/produits')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-text-faint" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate('/admin/produits')}
        className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ChevronLeft size={16} />
        Retour aux produits
      </button>

      <h1 className="mt-4 font-display text-2xl font-black tracking-tight">
        {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="name" label="Nom" value={name} onChange={handleNameChange} required />
          <Input
            id="slug"
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="category"
            label="Catégorie"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              Choisir une catégorie
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Input
            id="base_price"
            type="number"
            min="0"
            label="Prix de base (XOF)"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-text-muted">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none rounded-xl border border-border-strong bg-surface px-4 py-3 text-text outline-none transition-colors duration-200 placeholder:text-text-faint focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex w-fit items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Produit visible sur le site
          </label>
          <label className="flex w-fit items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Produit vedette (affiché dans « Collections en vedette » sur l'accueil)
          </label>
        </div>

        {/* Image */}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-text uppercase">Image</h2>
          <div className="mt-3">
            {images[0] ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-xl">
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(images[0])}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bg/80 text-text"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-strong text-text-faint transition-colors hover:border-accent hover:text-accent">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span className="text-xs">Ajouter</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Variantes */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-text uppercase">
              Variantes
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={addVariant}>
              <Plus size={14} />
              Ajouter
            </Button>
          </div>
          <p className="mt-1 text-xs text-text-faint">
            Pour un produit sans taille (montre, collier…), laisse le champ
            Taille vide : le produit reste achetable normalement.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-3 sm:items-end"
              >
                <Input
                  id={`size-${variant.id}`}
                  label="Taille (optionnel)"
                  placeholder="Ex: M, 42… (vide si sans taille)"
                  value={variant.size}
                  onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
                />
                <Input
                  id={`price-${variant.id}`}
                  type="number"
                  min="0"
                  label="Prix (optionnel)"
                  value={variant.price}
                  onChange={(e) => updateVariant(variant.id, { price: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  className="flex h-11 items-center justify-center rounded-xl text-text-faint transition-colors hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
