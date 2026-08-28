import { supabase } from './supabaseClient'
import { generateId } from './id'

const BUCKET = 'product-images'

/** Envoie une image vers le bucket Storage et retourne son URL publique. */
export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${generateId()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Supprime une image du bucket à partir de son URL publique. */
export async function deleteProductImage(publicUrl) {
  const path = publicUrl.split(`${BUCKET}/`).pop()
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}
