import type { Photo } from '@/types/gallery'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const API_TOKEN = import.meta.env.VITE_STRAPI_TOKEN

// Request headers
const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
}

export interface StrapiPhoto {
  documentId: string
  title: string
  description: string
  slug: string
  image: {
    url: string
    alternativeText: string
    width: number
    height: number
    formats: {
      thumbnail?: { url: string; width: number; height: number }
      small?: { url: string; width: number; height: number }
      medium?: { url: string; width: number; height: number }
      large?: { url: string; width: number; height: number }
    }
  }
  category: string
  tags: string[]
  featured: boolean
  cameraSettings?: {
    camera: string
    lens: string
    aperture: string
    shutterSpeed: string
    iso: number
    focalLength: string
  }
  location?: string
  captureDate?: string
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
}

export const strapiService = {
  async getPhotos(params?: {
    category?: string
    featured?: boolean
    limit?: number
    sort?: string
  }): Promise<Photo[]> {
    try {
      const query = new URLSearchParams()
      
      // Add filters
      if (params?.category) {
        query.append('filters[category][$eq]', params.category)
      }
      if (params?.featured !== undefined) {
        query.append('filters[featured][$eq]', params.featured.toString())
      }
      if (params?.limit) {
        query.append('pagination[limit]', params.limit.toString())
      }
      if (params?.sort) {
        query.append('sort[0]', params.sort)
      }

      // Always populate related data
      query.append('populate', '*')

      const response = await fetch(
        `${STRAPI_URL}/api/photos?${query}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return transformStrapiData(data.data)
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  },

  async getPhoto(id: string): Promise<Photo | null> {
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/photos/${id}?populate=*`,
        { headers }
      )

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return transformStrapiPhoto(data.data)
    } catch (error) {
      console.error('Error fetching photo:', error)
      throw error
    }
  },

  async likePhoto(photoId: string): Promise<{ success: boolean; likeCount: number }> {
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/likes`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            data: {
              photo: photoId
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        likeCount: data.data.photo?.likeCount || 0
      }
    } catch (error) {
      console.error('Error liking photo:', error)
      return { success: false, likeCount: 0 }
    }
  }
}

function transformStrapiData(strapiPhotos: StrapiPhoto[]): Photo[] {
  return strapiPhotos.map(transformStrapiPhoto)
}

function transformStrapiPhoto(strapiPhoto: StrapiPhoto): Photo {
  return {
    documentId: strapiPhoto.documentId,
    title: strapiPhoto.title,
    description: strapiPhoto.description,
    image: {
      url: strapiPhoto.image.url,
      alternativeText: strapiPhoto.image.alternativeText,
      width: strapiPhoto.image.width,
      height: strapiPhoto.image.height,
      formats: strapiPhoto.image.formats
    },
    category: strapiPhoto.category as Photo['category'],
    featured: strapiPhoto.featured,
    tags: strapiPhoto.tags || [],
    metadata: strapiPhoto.cameraSettings ? {
      camera: strapiPhoto.cameraSettings.camera,
      lens: strapiPhoto.cameraSettings.lens,
      settings: `${strapiPhoto.cameraSettings.aperture} • ${strapiPhoto.cameraSettings.shutterSpeed} • ISO ${strapiPhoto.cameraSettings.iso}`,
      location: strapiPhoto.location,
      date: strapiPhoto.captureDate
    } : undefined,
    viewCount: strapiPhoto.viewCount || 0,
    likeCount: strapiPhoto.likeCount || 0,
    createdAt: strapiPhoto.createdAt,
    updatedAt: strapiPhoto.updatedAt
  }
} 