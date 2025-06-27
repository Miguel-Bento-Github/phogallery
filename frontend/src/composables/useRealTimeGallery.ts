import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

interface RealTimeState {
  connected: boolean
  error: string | null
  onlineUsers: number
}

export function useRealTimeGallery() {
  const socket = ref<Socket | null>(null)
  const state = reactive<RealTimeState>({
    connected: false,
    error: null,
    onlineUsers: 0
  })

  const photoStats = ref<Record<string, { likes: number; views: number }>>({})
  const recentActivity = ref<Array<{ type: string; data: any; timestamp: Date }>>([])

  const connect = () => {
    // Real-time connection disabled for now
    console.log('📡 Real-time connection disabled - using fallback mode')
    state.connected = false
    state.error = 'Real-time features temporarily disabled'
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const joinPhoto = (photoId: string) => {
    if (socket.value && state.connected) {
      socket.value.emit('join-photo', photoId)
    }
  }

  const likePhoto = (photoId: string) => {
    // Use direct API call instead of Socket.IO
    console.log('❤️ Like photo (offline mode):', photoId)
    
    // Update local stats optimistically
    if (photoStats.value[photoId]) {
      photoStats.value[photoId].likes++
    } else {
      photoStats.value[photoId] = { likes: 1, views: 0 }
    }
    
    addActivity('like', { photoId, likeCount: photoStats.value[photoId].likes })
  }

  const viewPhoto = (photoId: string) => {
    // Use direct API call instead of Socket.IO
    console.log('👁️ View photo (offline mode):', photoId)
    
    // Update local stats
    if (photoStats.value[photoId]) {
      photoStats.value[photoId].views++
    } else {
      photoStats.value[photoId] = { likes: 0, views: 1 }
    }
  }

  const initializePhotoStats = (photos: any[]) => {
    photos.forEach(photo => {
      photoStats.value[photo.documentId] = {
        likes: photo.likeCount || 0,
        views: photo.viewCount || 0
      }
    })
  }

  const addActivity = (type: string, data: any) => {
    recentActivity.value.unshift({
      type,
      data,
      timestamp: new Date()
    })

    // Keep only last 50 activities
    if (recentActivity.value.length > 50) {
      recentActivity.value = recentActivity.value.slice(0, 50)
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    state,
    photoStats,
    recentActivity,
    connect,
    disconnect,
    joinPhoto,
    likePhoto,
    viewPhoto,
    initializePhotoStats
  }
} 