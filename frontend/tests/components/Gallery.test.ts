import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Gallery from '@/components/Gallery/Gallery.vue'
import { createPinia } from 'pinia'

// Mock the gallery store
const mockLoadPhotos = vi.fn()
const mockSelectPhoto = vi.fn()

vi.mock('@/stores/gallery', () => ({
  useGalleryStore: () => ({
    photos: [],
    filteredPhotos: [
      {
        documentId: '1',
        title: 'Test Photo',
        image: { url: '/test.jpg', alternativeText: 'Test' },
        category: 'landscape',
        featured: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    loading: false,
    error: null,
    loadPhotos: mockLoadPhotos,
    selectPhoto: mockSelectPhoto
  })
}))

// Mock storeToRefs to return reactive values
vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia')
  return {
    ...actual,
    storeToRefs: (store: any) => ({
      filteredPhotos: { value: store.filteredPhotos },
      loading: { value: store.loading },
      error: { value: store.error }
    })
  }
})

describe('Gallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render gallery with photos', async () => {
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    expect(screen.getByText('Test Photo')).toBeInTheDocument()
  })

  it('should load photos on mount', () => {
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    expect(mockLoadPhotos).toHaveBeenCalled()
  })

  it('should call selectPhoto when photo is clicked', async () => {
    const user = userEvent.setup()
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    const photoCard = screen.getByTestId('photo-card')
    await user.click(photoCard)

    expect(mockSelectPhoto).toHaveBeenCalled()
  })
}) 