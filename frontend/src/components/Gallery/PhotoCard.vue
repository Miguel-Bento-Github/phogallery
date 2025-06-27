<template>
  <div
    data-testid="photo-card"
    class="photo-card group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    @click="handleCardClick"
  >
    <!-- Loading skeleton -->
    <div
      v-if="!imageLoaded && !imageError"
      data-testid="photo-skeleton"
      class="absolute inset-0 bg-gray-200 animate-pulse"
      :style="{ aspectRatio: `${photo.image.width || 16}/${photo.image.height || 9}` }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="imageError" class="flex items-center justify-center h-48 bg-gray-200">
      <span class="text-gray-500">Failed to load image</span>
    </div>

    <!-- Main image -->
    <img
      v-if="!imageError"
      :src="imageSource"
      :alt="photo.image.alternativeText || photo.title"
      class="w-full h-auto transition-opacity duration-300"
      :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }"
      @load="handleImageLoad"
      @error="handleImageError"
      :style="{ aspectRatio: `${photo.image.width || 16}/${photo.image.height || 9}` }"
    />

    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"
    >
      <!-- Like button -->
      <div class="absolute top-3 right-3 z-10">
        <button
          :aria-label="isLiked ? 'Unlike photo' : 'Like photo'"
          class="p-2 rounded-full bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
          :class="[
            isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-400',
          ]"
          @click.stop="handleLikeClick"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            :fill="isLiked ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>
      </div>

      <!-- Info overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
      >
        <h3 class="font-semibold text-sm truncate mb-1">
          {{ photo.title }}
        </h3>
        <p v-if="photo.description" class="text-xs opacity-80 mb-1">
          {{ photo.description }}
        </p>
        <div class="flex items-center justify-between">
          <div v-if="photo.category" class="text-xs opacity-80">
            {{ photo.category }}
          </div>
          <!-- Stats -->
          <div class="flex items-center gap-3 text-xs">
            <div v-if="displayLikeCount > 0" class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span>{{ displayLikeCount }}</span>
            </div>
            <div v-if="displayViewCount > 0" class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ displayViewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Photo } from '@/types/gallery'

interface Props {
  photo: Photo
  isLiked: boolean
  likeCount?: number
  viewCount?: number
}

interface Emits {
  (e: 'click'): void
  (e: 'like'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageLoaded = ref(false)
const imageError = ref(false)

const imageSource = computed(() => {
  const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
  if (props.photo.image.formats?.thumbnail) {
    return `${baseUrl}${props.photo.image.formats.thumbnail.url}`
  }
  return `${baseUrl}${props.photo.image.url}`
})

const displayLikeCount = computed(() => {
  return props.likeCount ?? props.photo.likeCount ?? 0
})

const displayViewCount = computed(() => {
  return props.viewCount ?? props.photo.viewCount ?? 0
})

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}

const handleCardClick = () => {
  emit('click')
}

const handleLikeClick = () => {
  emit('like')
}
</script>
 