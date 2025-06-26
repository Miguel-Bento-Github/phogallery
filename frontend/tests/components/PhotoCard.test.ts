import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import PhotoCard from '@/components/Gallery/PhotoCard.vue'
import type { Photo } from '@/types/gallery'

const mockPhoto: Photo = {
  documentId: '1',
  title: 'Mountain Sunset',
  description: 'Beautiful mountain landscape at sunset',
  image: {
    url: '/uploads/mountain.jpg',
    alternativeText: 'Mountain sunset landscape',
    formats: {
      thumbnail: { url: '/uploads/thumb_mountain.jpg', width: 400, height: 300 }
    }
  },
  category: 'landscape',
  featured: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('PhotoCard', () => {
  describe('Basic Rendering', () => {
    it('should render photo with correct title and alt text', () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      // Image exists with correct alt text (even if hidden initially)
      const image = document.querySelector('img')
      expect(image).toHaveAttribute('alt', mockPhoto.image.alternativeText)
      expect(screen.getByText(mockPhoto.title)).toBeInTheDocument()
    })

    it('should display loading state initially', () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      expect(screen.getByTestId('photo-skeleton')).toBeInTheDocument()
    })

    it('should emit click event when card is clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const card = screen.getByTestId('photo-card')
      await user.click(card)
      
      expect(emitted()).toHaveProperty('click')
    })
  })

  describe('Image Loading', () => {
    it('should hide skeleton and show image when loaded', async () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const image = document.querySelector('img')
      
      // Simulate image load
      await fireEvent.load(image!)
      
      // Skeleton should be hidden, image should be visible
      expect(screen.queryByTestId('photo-skeleton')).not.toBeInTheDocument()
      expect(image).toHaveClass('opacity-100')
    })

    it('should show error state when image fails to load', async () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const image = document.querySelector('img')
      
      // Simulate image error
      await fireEvent.error(image!)
      
      expect(screen.getByText('Failed to load image')).toBeInTheDocument()
    })
  })

  describe('Like Functionality', () => {
    it('should show heart button with correct state', () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: true }
      })
      
      const likeButton = screen.getByRole('button', { name: /unlike photo/i })
      expect(likeButton).toHaveClass('text-red-500')
    })

    it('should emit like event when heart button is clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const likeButton = screen.getByRole('button', { name: /like photo/i })
      await user.click(likeButton)
      
      expect(emitted()).toHaveProperty('like')
    })
  })
}) 