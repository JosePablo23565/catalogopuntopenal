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

  // ── PORTADA PREMIUM DE ALTA GAMA ──
  // Fondo oscuro lujoso
  pdf.setFillColor(11, 15, 25)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  // Círculos abstractos/orbes de neón suave
  pdf.setFillColor(30, 27, 75)
  pdf.circle(pageWidth, 0, 110, 'F') 
  pdf.setFillColor(49, 46, 129)
  pdf.circle(0, pageHeight, 70, 'F')

  // Marco de doble línea elegante
  pdf.setDrawColor(99, 102, 241) // Índigo brillante
  pdf.setLineWidth(0.4)
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16, 'D')

  pdf.setDrawColor(79, 70, 229)
  pdf.setLineWidth(0.2)
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, 'D')

  // Textos de la Portada
  pdf.setTextColor(165, 180, 252) // Índigo claro
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('TIENDA ONLINE', pageWidth / 2, 95, { align: 'center', charSpace: 3 })

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(36)
  pdf.text('CATÁLOGO', pageWidth / 2, 112, { align: 'center', charSpace: 4 })

  pdf.setFontSize(13)
  pdf.setTextColor(148, 163, 184) // Slate 300
  pdf.setFont('helvetica', 'normal')
  pdf.text('COLECCIÓN EXCLUSIVA', pageWidth / 2, 122, { align: 'center', charSpace: 2 })

  pdf.setDrawColor(99, 102, 241)
  pdf.setLineWidth(0.6)
  pdf.line(pageWidth / 2 - 25, 131, pageWidth / 2 + 25, 131)

  pdf.setFontSize(10)
  pdf.setTextColor(148, 163, 184)
  pdf.text('Estilo y Calidad en Cada Detalle', pageWidth / 2, 142, { align: 'center' })

  if (waNumber) {
    pdf.setFillColor(16, 185, 129) // Emerald
    pdf.roundedRect(pageWidth / 2 - 42, 162, 84, 11, 2, 2, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.textWithLink(
      `PEDIR POR WHATSAPP →`,
      pageWidth / 2,
      169.3,
      { align: 'center', url: `https://wa.me/${waNumber}` }
    )
  }

  // ── CONFIGURACIÓN DE PRODUCTOS ──
  pdf.addPage()
  drawPageHeader(pdf, margin, pageWidth)
  
  let currentY = margin + 18

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const col = i % cols

    if (col === 0 && i !== 0) {
      if (currentY + cardHeight + rowGap > pageHeight - margin - 15) {
        pdf.addPage()
        drawPageHeader(pdf, margin, pageWidth)
        currentY = margin + 18
      } else {
        currentY += cardHeight + rowGap
      }
    }

    const currentX = margin + col * (cardWidth + colGap)

    const productUrl = `${storeUrl}/producto/${product.id}`
    const message = `¡Hola! Me interesa este producto:\n\n${product.name}\nPrecio: ₡${product.price.toLocaleString()}\n\n${productUrl}`
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`

    const mainImg = product.product_images?.find(img => img.is_main) || product.product_images?.[0]

    // Sombra sutil de la tarjeta
    pdf.setFillColor(241, 245, 249) // Slate 100
    pdf.roundedRect(currentX + 0.6, currentY + 0.6, cardWidth, cardHeight, 4, 4, 'F')

    // Fondo de la Tarjeta
    pdf.setFillColor(255, 255, 255)
    pdf.setDrawColor(226, 232, 240) // Slate 200
    pdf.setLineWidth(0.2)
    pdf.roundedRect(currentX, currentY, cardWidth, cardHeight, 4, 4, 'FD')

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
    pdf.setTextColor(15, 23, 42) // Slate 900
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    const truncatedName = product.name.length > 20 ? product.name.slice(0, 20) + '...' : product.name
    pdf.textWithLink(truncatedName, currentX + 5, currentY + imgHeight + 9, { url: productUrl })

    // Precio
    pdf.setTextColor(99, 102, 241) // Accent Indigo
    pdf.setFontSize(9.5)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`₡${product.price.toLocaleString()}`, currentX + 5, currentY + imgHeight + 15.5)

    // Botón de Acción WhatsApp
    pdf.setFillColor(16, 185, 129) // Emerald
    pdf.roundedRect(currentX + 5, currentY + imgHeight + 21, cardWidth - 10, 8.5, 2, 2, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'bold')
    pdf.textWithLink(
      'Pedir por WhatsApp →',
      currentX + (cardWidth / 2),
      currentY + imgHeight + 26.8,
      { align: 'center', url: waLink }
    )
  }

  // ── FOOTERS ──
  const totalPages = pdf.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1) continue 
    
    pdf.setPage(p)
    
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.2)
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14)

    pdf.setTextColor(148, 163, 184)
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    
    pdf.text(`CamisasShop  |  ${storeUrl.replace(/^https?:\/\//, '')}`, margin, pageHeight - 9)
    pdf.text(`Página ${p} de ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: 'right' })
  }

  pdf.save('catalogo-camisas.pdf')
}

const drawPageHeader = (pdf: jsPDF, margin: number, pageWidth: number) => {
  pdf.setTextColor(99, 102, 241) // Accent Indigo
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('CAMISASSHOP', margin, margin + 4)
  
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(148, 163, 184) // Slate 400
  pdf.setFontSize(6.5)
  pdf.text('COLECCIÓN EXCLUSIVA', margin, margin + 8)

  pdf.setDrawColor(226, 232, 240) // Slate 200
  pdf.setLineWidth(0.2)
  pdf.line(margin, margin + 10, pageWidth - margin, margin + 10)
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