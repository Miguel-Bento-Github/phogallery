import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Photo, FilterOptions } from '@/types/gallery'
import { strapiService } from '@/services/strapi'

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedPhoto = ref<Photo | null>(null)
  const selectedIndex = ref(0)
  const isLightboxOpen = ref(false)
  const activeFilters = ref<FilterOptions>({})

  // Getters
  const filteredPhotos = computed(() => {
    let result = photos.value

    if (activeFilters.value.category) {
      result = result.filter(photo => photo.category === activeFilters.value.category)
    }

    if (activeFilters.value.featured !== undefined) {
      result = result.filter(photo => photo.featured === activeFilters.value.featured)
    }

    if (activeFilters.value.tags?.length) {
      result = result.filter(photo => 
        photo.tags?.some(tag => activeFilters.value.tags?.includes(tag))
      )
    }

    if (activeFilters.value.search) {
      const searchTerm = activeFilters.value.search.toLowerCase()
      result = result.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm) ||
        photo.description?.toLowerCase().includes(searchTerm)
      )
    }

    return result
  })

  const categories = computed(() => {
    const cats = new Set(photos.value.map(photo => photo.category).filter(Boolean))
    return Array.from(cats) as string[]
  })

  const featuredPhotos = computed(() => {
    return photos.value.filter(photo => photo.featured)
  })

  // Actions
  const loadPhotos = async (params?: {
    category?: string
    featured?: boolean
    limit?: number
  }) => {
    loading.value = true
    error.value = null
    
    try {
      photos.value = await strapiService.getPhotos(params)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load photos'
      console.error('Error loading photos:', err)
    } finally {
      loading.value = false
    }
  }

  const loadPhoto = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const photo = await strapiService.getPhoto(id)
      if (photo) {
        selectedPhoto.value = photo
        // Add to photos array if not already present
        const existingIndex = photos.value.findIndex(p => p.documentId === id)
        if (existingIndex === -1) {
          photos.value.push(photo)
        }
      }
      return photo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load photo'
      console.error('Error loading photo:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const selectPhoto = (photo: Photo, index: number) => {
    selectedPhoto.value = photo
    selectedIndex.value = index
    isLightboxOpen.value = true
  }

  const closeLightbox = () => {
    isLightboxOpen.value = false
    selectedPhoto.value = null
  }

  const nextPhoto = () => {
    const currentIndex = selectedIndex.value
    const nextIndex = (currentIndex + 1) % filteredPhotos.value.length
    const nextPhoto = filteredPhotos.value[nextIndex]
    selectPhoto(nextPhoto, nextIndex)
  }

  const previousPhoto = () => {
    const currentIndex = selectedIndex.value
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.value.length - 1
    const prevPhoto = filteredPhotos.value[prevIndex]
    selectPhoto(prevPhoto, prevIndex)
  }

  const setFilter = (filters: FilterOptions) => {
    activeFilters.value = { ...activeFilters.value, ...filters }
  }

  const clearFilters = () => {
    activeFilters.value = {}
  }

  return {
    // State
    photos,
    loading,
    error,
    selectedPhoto,
    selectedIndex,
    isLightboxOpen,
    activeFilters,
    // Getters
    filteredPhotos,
    categories,
    featuredPhotos,
    // Actions
    loadPhotos,
    loadPhoto,
    selectPhoto,
    closeLightbox,
    nextPhoto,
    previousPhoto,
    setFilter,
    clearFilters
  }
}) 