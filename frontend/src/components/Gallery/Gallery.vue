<template>
  <div class="gallery-container">
    <!-- Real-time connection status -->
    <div class="fixed top-4 right-4 z-50">
      <div 
        class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
        :class="connectionStatusClass"
      >
        <div 
          class="w-2 h-2 rounded-full"
          :class="{ 'bg-white animate-pulse': realTimeState.connected, 'bg-gray-400': !realTimeState.connected }"
        ></div>
        <span>{{ realTimeState.connected ? 'Live' : 'Offline' }}</span>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <select 
          v-model="selectedCategory" 
          @change="handleCategoryChange"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category.charAt(0).toUpperCase() + category.slice(1) }}
          </option>
        </select>

        <button
          @click="setFilter({ featured: true })"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Featured Only
        </button>

        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading photos...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600 py-8">
      <p class="text-lg font-medium">{{ error }}</p>
      <button 
        @click="() => loadPhotos()"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Photos Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PhotoCard
        v-for="(photo, index) in filteredPhotos"
        :key="photo.documentId"
        :photo="photo"
        :is-liked="false"
        :like-count="getRealTimeLikeCount(photo.documentId)"
        :view-count="getRealTimeViewCount(photo.documentId)"
        @click="handlePhotoClick(photo, index)"
        @like="handleLike(photo.documentId)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredPhotos.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No photos found</p>
      <button 
        @click="clearFilters"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Show All Photos
      </button>
    </div>

    <!-- Real-time activity feed -->
    <div v-if="recentActivity.length > 0" class="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border p-4">
      <h3 class="font-semibold mb-3 text-gray-900">Live Activity</h3>
      <div class="space-y-2">
        <div 
          v-for="activity in recentActivity.slice(0, 10)" 
          :key="`${activity.type}-${activity.timestamp}`"
          class="text-sm text-gray-600 p-2 bg-gray-50 rounded"
        >
          <span class="font-medium">{{ formatActivity(activity) }}</span>
          <span class="text-xs text-gray-400 block">{{ formatTime(activity.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '@/stores/gallery'
import { useRealTimeGallery } from '@/composables/useRealTimeGallery'
import PhotoCard from './PhotoCard.vue'

const galleryStore = useGalleryStore()
const realTime = useRealTimeGallery()

const {
  filteredPhotos,
  categories,
  loading,
  error
} = storeToRefs(galleryStore)

const {
  loadPhotos,
  selectPhoto,
  setFilter,
  clearFilters
} = galleryStore

const {
  state: realTimeState,
  photoStats,
  recentActivity,
  joinPhoto,
  likePhoto,
  viewPhoto,
  initializePhotoStats
} = realTime

const selectedCategory = ref('')

const connectionStatusClass = computed(() => ({
  'bg-green-500 text-white': realTimeState.connected,
  'bg-red-500 text-white': !realTimeState.connected
}))

const handleCategoryChange = () => {
  if (selectedCategory.value) {
    setFilter({ category: selectedCategory.value })
  } else {
    clearFilters()
  }
}

const handlePhotoClick = (photo: any, index: number) => {
  selectPhoto(photo, index)
  joinPhoto(photo.documentId)
  viewPhoto(photo.documentId)
}

const handleLike = (photoId: string) => {
  likePhoto(photoId)
}

const getRealTimeLikeCount = (photoId: string) => {
  return photoStats.value[photoId]?.likes ?? 0
}

const getRealTimeViewCount = (photoId: string) => {
  return photoStats.value[photoId]?.views ?? 0
}

const formatActivity = (activity: any) => {
  switch (activity.type) {
    case 'like':
      return `Photo received a like! (${activity.data.likeCount} total)`
    case 'new-photo':
      return `New photo added: "${activity.data.title}"`
    case 'photo-update':
      return `Photo updated`
    case 'photo-delete':
      return `Photo removed`
    default:
      return 'Activity occurred'
  }
}

const formatTime = (timestamp: Date) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((timestamp.getTime() - Date.now()) / 1000),
    'second'
  )
}

onMounted(async () => {
  await loadPhotos()
  initializePhotoStats(filteredPhotos.value)
})
</script>

<style scoped>
.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
 