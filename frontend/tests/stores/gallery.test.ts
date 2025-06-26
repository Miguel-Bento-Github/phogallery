import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGalleryStore } from '@/stores/gallery'
import type { Photo } from '@/types/gallery'

const mockPhotos: Photo[] = [
  {
    documentId: '1',
    title: 'Mountain View',
    image: { url: '/mountain.jpg', alternativeText: 'Mountain' },
    category: 'landscape',
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    documentId: '2',
    title: 'City Lights',
    image: { url: '/city.jpg', alternativeText: 'City' },
    category: 'urban',
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

// Mock fetch
global.fetch = vi.fn()

describe('Gallery Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const store = useGalleryStore()
      
      expect(store.photos).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.selectedPhoto).toBe(null)
      expect(store.isLightboxOpen).toBe(false)
    })
  })

  describe('Loading Photos', () => {
    it('should set loading state during fetch', async () => {
      const store = useGalleryStore()
      
      // Mock delayed response
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockPhotos })
        }), 100))
      )

      const fetchPromise = store.loadPhotos()
      expect(store.loading).toBe(true)
      
      await fetchPromise
      expect(store.loading).toBe(false)
    })

    it('should populate photos on successful fetch', async () => {
      const store = useGalleryStore()
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockPhotos })
      })

      await store.loadPhotos()
      
      expect(store.photos).toEqual(mockPhotos)
      expect(store.error).toBe(null)
    })

    it('should handle fetch errors', async () => {
      const store = useGalleryStore()
      
      fetch.mockRejectedValueOnce(new Error('Network error'))

      await store.loadPhotos()
      
      expect(store.error).toBe('Failed to load photos')
      expect(store.photos).toEqual([])
    })
  })

  describe('Photo Selection', () => {
    it('should select photo and open lightbox', () => {
      const store = useGalleryStore()
      store.photos = mockPhotos
      
      store.selectPhoto(mockPhotos[0], 0)
      
      expect(store.selectedPhoto).toStrictEqual(mockPhotos[0])
      expect(store.selectedIndex).toBe(0)
      expect(store.isLightboxOpen).toBe(true)
    })

    it('should close lightbox and clear selection', () => {
      const store = useGalleryStore()
      store.selectedPhoto = mockPhotos[0]
      store.isLightboxOpen = true
      
      store.closeLightbox()
      
      expect(store.selectedPhoto).toBe(null)
      expect(store.isLightboxOpen).toBe(false)
    })
  })

  describe('Filtering', () => {
    it('should filter photos by category', () => {
      const store = useGalleryStore()
      store.photos = mockPhotos
      
      store.setFilter({ category: 'landscape' })
      
      expect(store.filteredPhotos).toEqual([mockPhotos[0]])
    })

    it('should return all photos when no filter is set', () => {
      const store = useGalleryStore()
      store.photos = mockPhotos
      
      expect(store.filteredPhotos).toEqual(mockPhotos)
    })
  })
}) 