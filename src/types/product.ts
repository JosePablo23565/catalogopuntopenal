export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  league: string
  category: string
  season: string
  created_at: string
  product_images?: ProductImage[]
}