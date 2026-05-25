export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  sizes: string[]
  colors: string[]
  stock: number
  created_at: string
  product_images: ProductImage[]
}