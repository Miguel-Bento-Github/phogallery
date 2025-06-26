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
    const socketUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
    
    socket.value = io(socketUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    })

    // Connection events
    socket.value.on('connect', () => {
      state.connected = true
      state.error = null
      console.log('🟢 Real-time connection established')
    })

    socket.value.on('disconnect', () => {
      state.connected = false
      console.log('🔴 Real-time connection lost')
    })

    socket.value.on('connect_error', (error) => {
      state.error = error.message
      console.error('❌ Real-time connection error:', error)
    })

    // Photo events
    socket.value.on('photo:like-update', (data) => {
      if (photoStats.value[data.photoId]) {
        photoStats.value[data.photoId].likes = data.likeCount
      }
      
      addActivity('like', {
        photoId: data.photoId,
        likeCount: data.likeCount
      })
    })

    socket.value.on('photo:view-update', (data) => {
      if (photoStats.value[data.photoId]) {
        photoStats.value[data.photoId].views = data.viewCount
      }
    })

    socket.value.on('gallery:new-photo', (data) => {
      addActivity('new-photo', data.photo)
    })

    socket.value.on('photo:updated', (data) => {
      addActivity('photo-update', data)
    })

    socket.value.on('photo:deleted', (data) => {
      addActivity('photo-delete', data)
    })

    socket.value.connect()
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
    if (socket.value && state.connected) {
      socket.value.emit('photo:like', { photoId })
    }
  }

  const viewPhoto = (photoId: string) => {
    if (socket.value && state.connected) {
      socket.value.emit('photo:view', { photoId })
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