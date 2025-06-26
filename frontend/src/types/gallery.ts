export interface Photo {
  documentId: string
  title: string
  description?: string
  image: {
    url: string
    alternativeText?: string
    width?: number
    height?: number
    formats?: {
      thumbnail?: { url: string; width: number; height: number }
      small?: { url: string; width: number; height: number }
      medium?: { url: string; width: number; height: number }
      large?: { url: string; width: number; height: number }
    }
  }
  category: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro' | 'wedding'
  featured: boolean
  tags?: string[]
  metadata?: {
    camera?: string
    lens?: string
    settings?: string
    location?: string
    date?: string
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
  viewCount?: number
  likeCount?: number
}

export interface GalleryState {
  photos: Photo[]
  loading: boolean
  error: string | null
  selectedPhoto: Photo | null
  selectedIndex: number
  isLightboxOpen: boolean
  activeCategory: string
}

export interface FilterOptions {
  category?: string
  tags?: string[]
  featured?: boolean
  search?: string
} 