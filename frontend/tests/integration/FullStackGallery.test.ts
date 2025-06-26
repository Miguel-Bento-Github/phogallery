import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Gallery from '@/components/Gallery/Gallery.vue'
import { createPinia } from 'pinia'

// Mock the Strapi service
const mockPhotos = [
  {
    documentId: '1',
    title: 'Mountain View',
    image: { url: '/mountain.jpg', alternativeText: 'Mountain' },
    category: 'landscape',
    featured: true,
    likeCount: 5,
    viewCount: 100,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    documentId: '2',
    title: 'City Portrait',
    image: { url: '/city.jpg', alternativeText: 'City' },
    category: 'portrait',
    featured: false,
    likeCount: 2,
    viewCount: 50,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

vi.mock('@/services/strapi', () => ({
  strapiService: {
    getPhotos: vi.fn(() => Promise.resolve(mockPhotos)),
    likePhoto: vi.fn(() => Promise.resolve({ success: true, likeCount: 6 }))
  }
}))

// Mock real-time composable
vi.mock('@/composables/useRealTimeGallery', () => ({
  useRealTimeGallery: () => ({
    state: { connected: true, error: null },
    photoStats: { value: {} },
    recentActivity: { value: [] },
    joinPhoto: vi.fn(),
    likePhoto: vi.fn(),
    viewPhoto: vi.fn(),
    initializePhotoStats: vi.fn()
  })
}))

describe('Full-Stack Gallery Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load and display photos from Strapi', async () => {
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    await waitFor(() => {
      expect(screen.getByText('Mountain View')).toBeInTheDocument()
      expect(screen.getByText('City Portrait')).toBeInTheDocument()
    })
  })

  it('should filter photos by category', async () => {
    const user = userEvent.setup()
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    await waitFor(() => {
      expect(screen.getByText('Mountain View')).toBeInTheDocument()
    })

    const categorySelect = screen.getByRole('combobox')
    await user.selectOptions(categorySelect, 'landscape')

    // Should show only landscape photos
    expect(screen.getByText('Mountain View')).toBeInTheDocument()
    expect(screen.queryByText('City Portrait')).not.toBeInTheDocument()
  })

  it('should show real-time connection status', async () => {
    render(Gallery, {
      global: { plugins: [createPinia()] }
    })

    expect(screen.getByText('Live')).toBeInTheDocument()
  })
}) 