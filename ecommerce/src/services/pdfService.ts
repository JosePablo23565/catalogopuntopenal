import jsPDF from 'jspdf'
import type { Product } from '../types/product'
import type { Settings } from '../types/settings'

export const generateCatalogPDF = async (
  products: Product[],
  settings: Settings,
  storeUrl: string
) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const pageHeight = 297
  
  const margin = 16
  const colGap = 10
  const rowGap = 10
  const cols = 2
  const cardWidth = (pageWidth - (margin * 2) - (colGap * (cols - 1))) / cols
  const cardHeight = 95
  const imgHeight = 54

  const waNumber = `${settings.whatsapp_country_code}${settings.whatsapp_number.replace(/\s/g, '')}`

  // ── PORTADA PREMIUM ──
  pdf.setFillColor(15, 17, 26)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  pdf.setFillColor(30, 27, 75)
  pdf.circle(pageWidth, 0, 120, 'F') 
  pdf.setFillColor(79, 70, 229)
  pdf.circle(0, pageHeight, 60, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(36)
  pdf.text('CATÁLOGO', pageWidth / 2, 110, { align: 'center', charSpace: 2 })

  pdf.setFontSize(18)
  pdf.setTextColor(129, 140, 248) 
  pdf.setFont('helvetica', 'normal')
  pdf.text('CamisasShop', pageWidth / 2, 123, { align: 'center' })

  pdf.setDrawColor(79, 70, 229)
  pdf.setLineWidth(0.75)
  pdf.line(pageWidth / 2 - 25, 132, pageWidth / 2 + 25, 132)

  pdf.setFontSize(11)
  pdf.setTextColor(156, 163, 175)
  pdf.text('Colección Exclusiva', pageWidth / 2, 142, { align: 'center' })

  if (waNumber) {
    pdf.setFillColor(16, 185, 129) 
    pdf.roundedRect(pageWidth / 2 - 45, 160, 90, 12, 2, 2, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.textWithLink(
      `Pedir por WhatsApp`,
      pageWidth / 2,
      168,
      { align: 'center', url: `https://wa.me/${waNumber}` }
    )
  }

  // ── CONFIGURACIÓN DE PRODUCTOS ──
  pdf.addPage()
  
  let currentY = margin

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const col = i % cols

    if (col === 0 && i !== 0) {
      if (currentY + cardHeight + rowGap > pageHeight - margin - 15) {
        pdf.addPage()
        currentY = margin
      } else {
        currentY += cardHeight + rowGap
      }
    }

    const currentX = margin + col * (cardWidth + colGap)

    const productUrl = `${storeUrl}/producto/${product.id}`
    const message = `¡Hola! Me interesa este producto:\n\n${product.name}\nPrecio: CRC ${product.price.toLocaleString()}\n\n${productUrl}`
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`

    const mainImg = product.product_images?.find(img => img.is_main) || product.product_images?.[0]

    // Sombra de la tarjeta
    pdf.setFillColor(243, 244, 246)
    pdf.roundedRect(currentX + 1, currentY + 1, cardWidth, cardHeight, 3, 3, 'F')

    // Fondo de la Tarjeta
    pdf.setFillColor(255, 255, 255)
    pdf.setDrawColor(229, 231, 235) 
    pdf.setLineWidth(0.2)
    pdf.roundedRect(currentX, currentY, cardWidth, cardHeight, 3, 3, 'FD')

    // ── Renderizado de Imagen con Ajuste de Proporción ──
    if (mainImg?.url) {
      try {
        const imgDimensions = await loadImageDimensions(mainImg.url)
        
        // Área máxima disponible para la imagen dentro de la tarjeta
        const maxW = cardWidth - 6
        const maxH = imgHeight
        
        // Calcular proporciones (Simulación de object-fit: contain)
        const imgRatio = imgDimensions.width / imgDimensions.height
        const containerRatio = maxW / maxH
        
        let finalW = maxW
        let finalH = maxH
        
        if (imgRatio > containerRatio) {
          finalH = maxW / imgRatio
        } else {
          finalW = maxH * imgRatio
        }
        
        // Centrar la imagen en su contenedor asignado
        const offsetX = currentX + 3 + (maxW - finalW) / 2
        const offsetY = currentY + 3 + (maxH - finalH) / 2

        pdf.addImage(imgDimensions.base64, 'JPEG', offsetX, offsetY, finalW, finalH, undefined, 'FAST')
      } catch {
        drawPlaceholder(pdf, currentX + 3, currentY + 3, cardWidth - 6, imgHeight)
      }
    } else {
      drawPlaceholder(pdf, currentX + 3, currentY + 3, cardWidth - 6, imgHeight)
    }

    // Nombre del Producto
    pdf.setTextColor(17, 24, 39)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    const truncatedName = product.name.length > 22 ? product.name.slice(0, 22) + '...' : product.name
    pdf.textWithLink(truncatedName, currentX + 5, currentY + imgHeight + 9, { url: productUrl })

    // Precio
    pdf.setTextColor(79, 70, 229)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`CRC ${product.price.toLocaleString()}`, currentX + 5, currentY + imgHeight + 16)

    // Botón de Acción WhatsApp
    pdf.setFillColor(16, 185, 129)
    pdf.roundedRect(currentX + 5, currentY + imgHeight + 22, cardWidth - 10, 8, 1.5, 1.5, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.textWithLink(
      'Pedir por WhatsApp →',
      currentX + (cardWidth / 2),
      currentY + imgHeight + 27.3,
      { align: 'center', url: waLink }
    )
  }

  // ── FOOTERS ──
  const totalPages = pdf.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1) continue 
    
    pdf.setPage(p)
    
    pdf.setDrawColor(243, 244, 246)
    pdf.setLineWidth(0.5)
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14)

    pdf.setTextColor(107, 114, 128)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    
    pdf.text(`CamisasShop  |  ${storeUrl.replace(/^https?:\/\//, '')}`, margin, pageHeight - 8)
    pdf.text(`Página ${p} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
  }

  pdf.save('catalogo-camisas.pdf')
}

const drawPlaceholder = (pdf: jsPDF, x: number, y: number, w: number, h: number) => {
  pdf.setFillColor(249, 250, 251)
  pdf.roundedRect(x, y, w, h, 2, 2, 'F')
  pdf.setTextColor(156, 163, 175)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Imagen no disponible', x + w / 2, y + h / 2 + 2, { align: 'center' })
}

// ── AUXILIAR ACTUALIZADO: Retorna dimensiones reales además del Base64 ──
const loadImageDimensions = (url: string): Promise<{ base64: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      
      resolve({
        base64: canvas.toDataURL('image/jpeg', 0.8),
        width: img.width,
        height: img.height
      })
    }
    img.onerror = reject
    img.src = url
  })
}