/**
 * useImageProcessor
 * Recorta la imagen en cuadrado (centro) y la comprime para web.
 * Devuelve un File listo para subir a Supabase.
 */

interface ProcessOptions {
  /** Lado máximo en px. 0 = mantener tamaño original */
  maxSize?: number
  /** Calidad 0–1 para WebP/JPEG */
  quality?: number
  /** Formato de salida */
  format?: 'image/webp' | 'image/jpeg' | 'image/png'
}

const DEFAULTS: Required<ProcessOptions> = {
  maxSize: 1200,
  quality: 0.82,
  format: 'image/webp',
}

export async function processImage(
  file: File,
  options: ProcessOptions = {}
): Promise<File> {
  const opts = { ...DEFAULTS, ...options }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)

      // ── Recorte cuadrado centrado ──────────────────────────────
      const side = Math.min(img.naturalWidth, img.naturalHeight)
      const srcX = (img.naturalWidth - side) / 2
      const srcY = (img.naturalHeight - side) / 2

      // ── Tamaño de salida ──────────────────────────────────────
      const outSize =
        opts.maxSize === 0 ? side : Math.min(opts.maxSize, side)

      const canvas = document.createElement('canvas')
      canvas.width = outSize
      canvas.height = outSize

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, srcX, srcY, side, side, 0, 0, outSize, outSize)

      // ── Convertir a Blob y luego a File ───────────────────────
      const quality =
        opts.format === 'image/png' ? undefined : opts.quality

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('No se pudo procesar la imagen'))
          const ext =
            opts.format === 'image/webp'
              ? 'webp'
              : opts.format === 'image/jpeg'
              ? 'jpg'
              : 'png'
          const baseName = file.name.replace(/\.[^.]+$/, '')
          const newFile = new File([blob], `${baseName}.${ext}`, {
            type: opts.format,
          })
          resolve(newFile)
        },
        opts.format,
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo cargar la imagen'))
    }

    img.src = url
  })
}
