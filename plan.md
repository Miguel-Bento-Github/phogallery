# Vue.js Photography Portfolio: Modern Implementation Guide

An updated comprehensive implementation plan using **Tailwind CSS v4**, **Strapi v5**, and **Vue 3** with cutting-edge development practices and production-ready configurations.

## Technology Stack Revolution

The modern photography portfolio implementation leverages three groundbreaking technology updates. **Tailwind CSS v4** introduces a revolutionary Rust-powered "Oxide" engine delivering **5x faster full builds** and **100x faster incremental builds**. **Strapi v5** transforms content management with its new Document Service API, flattened response format, and complete TypeScript migration. **Vue 3** provides the reactive foundation with Composition API patterns optimized for modern development workflows.

This stack combination eliminates traditional configuration complexity while delivering unprecedented performance. Tailwind v4's CSS-first approach replaces JavaScript configuration files with native CSS, Strapi v5's document-based architecture simplifies content relationships, and Vue 3's Composition API enables cleaner, more maintainable code patterns.

## Tailwind CSS v4 Setup and Configuration

### Modern Installation Process

The installation process for Tailwind CSS v4 with Vue 3 + Vite has been dramatically simplified:

```bash
# Create Vue 3 TypeScript project
npm create vue@latest portfolio-app -- --template vue-ts
cd portfolio-app
npm install

# Install Tailwind CSS v4 with first-party Vite plugin
npm install -D tailwindcss@latest @tailwindcss/vite
```

### Revolutionary Vite Plugin Configuration

The new `@tailwindcss/vite` plugin provides tighter integration and optimal performance:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // Zero configuration required
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```

### CSS-First Configuration Revolution

Tailwind v4 eliminates JavaScript configuration files entirely:

```css
/* src/assets/main.css */
@import "tailwindcss";

/* Theme configuration using CSS variables */
@theme {
  --color-primary: oklch(0.53 0.12 118.34);
  --color-accent: oklch(0.74 0.17 40.24);
  --font-display: "Inter Variable", system-ui, sans-serif;
  --breakpoint-3xl: 1920px;
}

/* Component styles with @layer */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors;
  }
  
  .photo-card {
    @apply bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow;
  }
}
```

### Breaking Changes and Migration Impact

**Critical browser support changes:**
- Minimum Safari 16.4+, Chrome 111+, Firefox 128+
- Uses modern CSS features: `@property`, `color-mix()`, cascade layers

**Configuration migration:**
```diff
// OLD: tailwind.config.js (v3)
- module.exports = {
-   content: ['./src/**/*.{vue,js,ts}'],
-   theme: {
-     extend: { colors: { primary: '#3b82f6' } }
-   }
- }

// NEW: main.css (v4)
+ @import "tailwindcss";
+ @theme {
+   --color-primary: #3b82f6;
+ }
```

**Utility class updates:**
- Shadow utilities: `shadow-sm` → `shadow-xs`, `shadow-md` → `shadow-sm`
- Ring utilities: `ring` now defaults to 1px (was 3px)
- Opacity utilities: Use `text-red-500/50` instead of `text-opacity-50`

## Strapi v5 Modern Integration

### Document Service API Architecture

Strapi v5 introduces a revolutionary Document Service API that fundamentally changes content management:

```javascript
// Modern Document Service API usage
const strapi = require('@strapi/strapi');

// Find documents with new API
const photos = await strapi.documents('api::photo.photo').findMany({
  filters: { category: { $eq: 'portrait' } },
  sort: 'createdAt:desc',
  populate: ['photographer', 'tags', 'image']
});

// Create document with simplified structure
const newPhoto = await strapi.documents('api::photo.photo').create({
  data: {
    title: 'Golden Hour Portrait',
    description: 'Professional portrait photography',
    category: 'portrait',
    featured: true
  }
});
```

### Flattened API Response Revolution

The new response format eliminates nested data structures:

```javascript
// Strapi v5 Response (Flattened)
{
  "data": {
    "documentId": "clkgylmcc000008lcdd868feh",
    "locale": "en",
    "title": "Mountain Landscape",
    "description": "Breathtaking mountain vista",
    "image": {
      "url": "/uploads/mountain_vista_abc123.jpg",
      "alternativeText": "Mountain landscape at sunset",
      "formats": {
        "large": { "url": "/uploads/large_mountain_abc123.jpg", "width": 1000 },
        "medium": { "url": "/uploads/medium_mountain_abc123.jpg", "width": 750 },
        "small": { "url": "/uploads/small_mountain_abc123.jpg", "width": 500 }
      }
    },
    "photographer": {
      "documentId": "photographer123",
      "name": "John Doe",
      "bio": "Professional landscape photographer"
    }
  }
}
```

### Content Type Modeling for Photography

```javascript
// Photography Portfolio Content Types
{
  "kind": "collectionType",
  "collectionName": "photos",
  "info": {
    "singularName": "photo",
    "pluralName": "photos",
    "displayName": "Photo"
  },
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "text" },
    "image": { 
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"]
    },
    "category": {
      "type": "enumeration",
      "enum": ["portrait", "landscape", "street", "wildlife", "macro"]
    },
    "featured": { "type": "boolean", "default": false },
    "captureDate": { "type": "date" },
    "location": { "type": "string" },
    "cameraSettings": { 
      "type": "component", 
      "component": "photography.camera-settings" 
    },
    "tags": { 
      "type": "relation", 
      "relation": "manyToMany", 
      "target": "api::tag.tag" 
    },
    "photographer": { 
      "type": "relation", 
      "relation": "manyToOne", 
      "target": "api::photographer.photographer" 
    }
  }
}
```

### Enhanced Media Library Configuration

```javascript
// config/plugins.js - Optimized for photography
module.exports = ({ env }) => ({
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      responsiveDimensions: true,
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_CLOUD_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
      },
      actionOptions: {
        upload: {
          quality: 'auto:best',
          fetch_format: 'auto'
        },
        delete: {},
      },
    },
  },
});
```

## Vue 3 Modern Integration Patterns

### Composition API with TypeScript Integration

```typescript
// composables/usePhotos.ts
import { ref, computed } from 'vue'
import type { Photo, StrapiCollectionResponse } from '@/types/strapi'

export function usePhotos() {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const strapiClient = {
    async fetchPhotos(params?: StrapiRequestParams): Promise<Photo[]> {
      loading.value = true
      error.value = null
      
      try {
        const query = new URLSearchParams()
        if (params?.filters) query.append('filters', JSON.stringify(params.filters))
        if (params?.sort) query.append('sort', params.sort)
        if (params?.populate) query.append('populate', '*')
        
        const response = await fetch(`${STRAPI_URL}/api/photos?${query}`, {
          headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data: StrapiCollectionResponse<Photo> = await response.json()
        photos.value = data.data
        return data.data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch photos'
        throw err
      } finally {
        loading.value = false
      }
    }
  }

  const featuredPhotos = computed(() => 
    photos.value.filter(photo => photo.featured)
  )

  const photosByCategory = computed(() => (category: string) =>
    photos.value.filter(photo => photo.category === category)
  )

  return {
    photos: computed(() => photos.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    featuredPhotos,
    photosByCategory,
    fetchPhotos: strapiClient.fetchPhotos
  }
}
```

### Modern TypeScript Type Definitions

```typescript
// types/strapi.ts
export interface StrapiSystemFields {
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  locale?: string
}

export interface Photo extends StrapiSystemFields {
  title: string
  description?: string
  image: StrapiMedia
  category: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro'
  featured: boolean
  captureDate?: string
  location?: string
  tags?: Tag[]
  photographer?: Photographer
  cameraSettings?: CameraSettings
}

export interface StrapiMedia {
  url: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
  formats?: {
    thumbnail?: MediaFormat
    small?: MediaFormat
    medium?: MediaFormat
    large?: MediaFormat
    xlarge?: MediaFormat
  }
}

export interface CameraSettings {
  camera: string
  lens: string
  aperture: string
  shutterSpeed: string
  iso: number
  focalLength: string
}
```

### State Management with Pinia

```typescript
// stores/portfolio.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePhotos } from '@/composables/usePhotos'

export const usePortfolioStore = defineStore('portfolio', () => {
  const { photos, loading, error, fetchPhotos, featuredPhotos } = usePhotos()
  
  const activeCategory = ref<string>('all')
  const searchQuery = ref<string>('')
  
  const filteredPhotos = computed(() => {
    let filtered = photos.value
    
    if (activeCategory.value !== 'all') {
      filtered = filtered.filter(photo => photo.category === activeCategory.value)
    }
    
    if (searchQuery.value) {
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    return filtered
  })
  
  const loadPortfolio = async () => {
    await fetchPhotos({
      populate: ['photographer', 'tags', 'image'],
      sort: 'captureDate:desc'
    })
  }
  
  const setCategory = (category: string) => {
    activeCategory.value = category
  }
  
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }
  
  return {
    photos,
    loading,
    error,
    featuredPhotos,
    filteredPhotos,
    activeCategory: computed(() => activeCategory.value),
    searchQuery: computed(() => searchQuery.value),
    loadPortfolio,
    setCategory,
    setSearchQuery
  }
})
```

## Advanced Performance Optimizations

### Optimized Image Component with Lazy Loading

```vue
<!-- components/OptimizedPhoto.vue -->
<template>
  <div class="photo-container" :class="containerClasses">
    <div
      v-if="!isLoaded"
      class="placeholder bg-gray-200 animate-pulse"
      :style="{ 
        paddingBottom: `${(photo.image.height / photo.image.width) * 100}%` 
      }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    
    <img
      ref="imageRef"
      :src="isIntersecting ? optimizedSrc : ''"
      :alt="photo.image.alternativeText || photo.title"
      :width="displayWidth"
      :height="displayHeight"
      @load="onLoad"
      @error="onError"
      class="photo-image"
      :class="{ 'opacity-100': isLoaded, 'opacity-0': !isLoaded }"
    />
    
    <div class="photo-overlay absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 class="font-semibold text-lg">{{ photo.title }}</h3>
        <p v-if="photo.description" class="text-sm mt-1 opacity-90">{{ photo.description }}</p>
        <div v-if="photo.cameraSettings" class="text-xs mt-2 opacity-75">
          {{ photo.cameraSettings.camera }} • {{ photo.cameraSettings.lens }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Photo } from '@/types/strapi'

interface Props {
  photo: Photo
  size?: 'small' | 'medium' | 'large'
  lazy?: boolean
  containerClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  lazy: true,
  containerClasses: 'rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow'
})

const imageRef = ref<HTMLImageElement>()
const isIntersecting = ref(false)
const isLoaded = ref(false)
const observer = ref<IntersectionObserver>()

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

const optimizedSrc = computed(() => {
  if (props.photo.image.formats?.[props.size]) {
    return `${STRAPI_URL}${props.photo.image.formats[props.size].url}`
  }
  return `${STRAPI_URL}${props.photo.image.url}`
})

const displayWidth = computed(() => {
  return props.photo.image.formats?.[props.size]?.width || props.photo.image.width || 800
})

const displayHeight = computed(() => {
  return props.photo.image.formats?.[props.size]?.height || props.photo.image.height || 600
})

const onLoad = () => {
  isLoaded.value = true
}

const onError = () => {
  console.error('Failed to load image:', props.photo.title)
}

onMounted(() => {
  if (props.lazy && imageRef.value) {
    observer.value = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true
          observer.value?.disconnect()
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    )
    observer.value.observe(imageRef.value)
  } else {
    isIntersecting.value = true
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.photo-container {
  @apply relative;
}

.placeholder {
  @apply absolute inset-0;
}

.photo-image {
  @apply w-full h-auto transition-opacity duration-300;
}
</style>
```

### Modern Build Configuration

```typescript
// vite.config.ts - Production optimized
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    visualizer({ open: true, gzipSize: true, brotliSize: true })
  ],
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        manualChunks: {
          'vue-ecosystem': ['vue', 'vue-router', 'pinia'],
          'ui-components': ['@headlessui/vue', '@heroicons/vue'],
          'utils': ['axios', '@vueuse/core']
        }
      }
    },
    
    cssCodeSplit: true,
    cssMinify: 'lightningcss'
  },
  
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'pinia'],
    exclude: ['@tailwindcss/vite']
  }
})
```

## Production Package.json

```json
{
  "name": "vue3-photography-portfolio",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "analyze": "vite build --mode analyze",
    "lint": "eslint . --ext .vue,.js,.ts --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    "@vueuse/core": "^10.5.0",
    "@vueuse/head": "^2.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "@tailwindcss/vite": "^4.0.0-alpha.12",
    "tailwindcss": "^4.0.0-alpha.12",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.22",
    "typescript": "^5.2.0",
    "@vue/eslint-config-typescript": "^12.0.0",
    "eslint": "^8.52.0",
    "rollup-plugin-visualizer": "^5.9.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Real-Time Architecture with WebSockets and Server-Sent Events

### Why Real-Time for Photography Portfolios?

Real-time features transform a static portfolio into an engaging, interactive experience:

- **Live Reactions**: Instant likes and comments on photos
- **Real-Time Analytics**: Live visitor counts and engagement metrics
- **Upload Progress**: Live photo upload progress and processing status
- **Gallery Updates**: Instant updates when new photos are added
- **Collaborative Features**: Real-time feedback from clients and collaborators
- **Live Events**: Real-time photo streams from events or shoots

### Technology Decision: WebSockets vs Server-Sent Events

**WebSockets**: Bi-directional, perfect for interactive features
- Photo likes/reactions
- Live comments and chat
- Collaborative editing
- Real-time notifications

**Server-Sent Events (SSE)**: Unidirectional, ideal for live updates
- Gallery updates
- Upload progress
- Analytics dashboards
- System notifications

### Strapi v5 Real-Time Setup

#### WebSocket Configuration with Socket.IO

```bash
# Install WebSocket dependencies in Strapi
cd backend
npm install socket.io @strapi/plugin-io cors
```

**Create WebSocket Hook (Strapi v5):**

```javascript
// backend/src/hooks/socket-io/index.js
const { Server } = require('socket.io')

module.exports = ({ strapi }) => {
  return {
    async register() {
      // Socket.IO will be initialized after server starts
    },

    async bootstrap() {
      const io = new Server(strapi.server.httpServer, {
        cors: {
          origin: process.env.CLIENT_URL || "http://localhost:3000",
          methods: ["GET", "POST"],
          credentials: true
        },
        transports: ['websocket', 'polling']
      })

      // Authentication middleware
      io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token
          if (token) {
            const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token)
            socket.userId = decoded.id
            socket.user = await strapi.entityService.findOne('plugin::users-permissions.user', decoded.id)
          }
          next()
        } catch (err) {
          next(err)
        }
      })

      // Store io instance globally
      strapi.io = io

      // Connection handling
      io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId || 'anonymous'}`)

        // Join user to their personal room
        if (socket.userId) {
          socket.join(`user:${socket.userId}`)
        }

        // Photo interaction events
        socket.on('photo:like', async (data) => {
          try {
            const { photoId } = data
            const userId = socket.userId

            if (!userId) {
              socket.emit('error', { message: 'Authentication required' })
              return
            }

            // Toggle like in database
            const existingLike = await strapi.db.query('api::like.like').findOne({
              where: { photo: photoId, user: userId }
            })

            let likeCount
            if (existingLike) {
              await strapi.db.query('api::like.like').delete({ where: { id: existingLike.id } })
              likeCount = await strapi.db.query('api::like.like').count({ where: { photo: photoId } })
              socket.emit('photo:unliked', { photoId, likeCount })
            } else {
              await strapi.db.query('api::like.like').create({
                data: { photo: photoId, user: userId }
              })
              likeCount = await strapi.db.query('api::like.like').count({ where: { photo: photoId } })
              socket.emit('photo:liked', { photoId, likeCount })
            }

            // Broadcast to all clients
            socket.broadcast.emit('photo:like-update', { photoId, likeCount })

          } catch (error) {
            socket.emit('error', { message: 'Failed to process like' })
          }
        })

        // Real-time view tracking
        socket.on('photo:view', async (data) => {
          try {
            const { photoId } = data
            
            // Increment view count
            await strapi.db.query('api::photo.photo').update({
              where: { documentId: photoId },
              data: { viewCount: { $inc: 1 } }
            })

            // Broadcast view count update
            const photo = await strapi.entityService.findOne('api::photo.photo', photoId, {
              fields: ['viewCount']
            })

            io.emit('photo:view-update', { 
              photoId, 
              viewCount: photo.viewCount 
            })

          } catch (error) {
            console.error('View tracking error:', error)
          }
        })

        // Disconnection handling
        socket.on('disconnect', () => {
          console.log(`User disconnected: ${socket.userId || 'anonymous'}`)
        })
      })

      console.log('Socket.IO server initialized')
    }
  }
}
```

#### Server-Sent Events Setup

```javascript
// backend/src/api/events/routes/events.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/stream',
      handler: 'events.stream',
      config: {
        auth: false // or configure as needed
      }
    }
  ]
}
```

```javascript
// backend/src/api/events/controllers/events.js
module.exports = ({ strapi }) => ({
  async stream(ctx) {
    ctx.request.socket.setTimeout(0)
    ctx.req.socket.setNoDelay(true)
    ctx.req.socket.setKeepAlive(true)

    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Send initial connection event
    ctx.res.write('data: {"type":"connected","message":"SSE connected"}\n\n')

    // Store client for broadcasting
    const clientId = Date.now().toString()
    strapi.sseClients = strapi.sseClients || new Map()
    strapi.sseClients.set(clientId, ctx.res)

    // Cleanup on disconnect
    ctx.req.on('close', () => {
      strapi.sseClients.delete(clientId)
    })

    ctx.req.on('finish', () => {
      strapi.sseClients.delete(clientId)
    })

    ctx.req.on('error', () => {
      strapi.sseClients.delete(clientId)
    })
  }
})
```

#### Lifecycle Hooks for Real-Time Updates

```javascript
// backend/src/api/photo/content-types/photo/lifecycles.js
module.exports = {
  async afterCreate(event) {
    const { result } = event

    // Broadcast new photo via SSE
    if (strapi.sseClients) {
      const message = JSON.stringify({
        type: 'photo:created',
        data: {
          documentId: result.documentId,
          title: result.title,
          category: result.category,
          featured: result.featured
        }
      })

      strapi.sseClients.forEach((client) => {
        try {
          client.write(`data: ${message}\n\n`)
        } catch (error) {
          console.error('SSE write error:', error)
        }
      })
    }

    // Broadcast via WebSocket
    if (strapi.io) {
      strapi.io.emit('gallery:new-photo', {
        photo: result
      })
    }
  },

  async afterUpdate(event) {
    const { result } = event

    // Broadcast photo update
    if (strapi.io) {
      strapi.io.emit('photo:updated', {
        photoId: result.documentId,
        data: result
      })
    }
  },

  async afterDelete(event) {
    const { result } = event

    // Broadcast photo deletion
    if (strapi.io) {
      strapi.io.emit('photo:deleted', {
        photoId: result.documentId
      })
    }
  }
}
```

### Vue 3 Real-Time Implementation

#### WebSocket Composable

```typescript
// src/composables/useWebSocket.ts
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

interface WebSocketState {
  connected: boolean
  error: string | null
  reconnecting: boolean
  reconnectAttempts: number
}

export function useWebSocket(url?: string, token?: string) {
  const socket = ref<Socket | null>(null)
  const state = reactive<WebSocketState>({
    connected: false,
    error: null,
    reconnecting: false,
    reconnectAttempts: 0
  })

  const connect = () => {
    const socketUrl = url || import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
    
    socket.value = io(socketUrl, {
      auth: token ? { token } : undefined,
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
      state.reconnecting = false
      state.reconnectAttempts = 0
      console.log('WebSocket connected')
    })

    socket.value.on('disconnect', (reason) => {
      state.connected = false
      console.log('WebSocket disconnected:', reason)
    })

    socket.value.on('connect_error', (error) => {
      state.error = error.message
      state.reconnectAttempts++
      console.error('WebSocket connection error:', error)
    })

    socket.value.on('reconnect', (attemptNumber) => {
      state.reconnecting = false
      state.reconnectAttempts = attemptNumber
      console.log('WebSocket reconnected after', attemptNumber, 'attempts')
    })

    socket.value.on('reconnect_attempt', (attemptNumber) => {
      state.reconnecting = true
      state.reconnectAttempts = attemptNumber
      console.log('WebSocket reconnecting... attempt', attemptNumber)
    })

    socket.value.on('reconnect_failed', () => {
      state.reconnecting = false
      state.error = 'Failed to reconnect after maximum attempts'
      console.error('WebSocket reconnection failed')
    })

    socket.value.connect()
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const emit = (event: string, data?: any) => {
    if (socket.value && state.connected) {
      socket.value.emit(event, data)
    } else {
      console.warn('Cannot emit: WebSocket not connected')
    }
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.off(event, callback)
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket: socket.value,
    state,
    connect,
    disconnect,
    emit,
    on,
    off
  }
}
```

#### Server-Sent Events Composable

```typescript
// src/composables/useServerSentEvents.ts
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface SSEState {
  connected: boolean
  error: string | null
  reconnecting: boolean
  lastEventId: string | null
}

interface SSEEvent {
  type: string
  data: any
  id?: string
  timestamp: Date
}

export function useServerSentEvents(url: string) {
  const eventSource = ref<EventSource | null>(null)
  const events = ref<SSEEvent[]>([])
  const state = reactive<SSEState>({
    connected: false,
    error: null,
    reconnecting: false,
    lastEventId: null
  })

  const connect = () => {
    try {
      eventSource.value = new EventSource(url)

      eventSource.value.onopen = () => {
        state.connected = true
        state.error = null
        state.reconnecting = false
        console.log('SSE connected')
      }

      eventSource.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const sseEvent: SSEEvent = {
            type: data.type || 'message',
            data: data.data || data,
            id: event.lastEventId,
            timestamp: new Date()
          }
          
          events.value.push(sseEvent)
          state.lastEventId = event.lastEventId
          
          // Keep only last 100 events to prevent memory leaks
          if (events.value.length > 100) {
            events.value = events.value.slice(-100)
          }
        } catch (error) {
          console.error('Failed to parse SSE data:', error)
        }
      }

      eventSource.value.onerror = (error) => {
        state.connected = false
        console.error('SSE error:', error)

        if (eventSource.value?.readyState === EventSource.CLOSED) {
          state.error = 'Connection closed'
          scheduleReconnect()
        }
      }

    } catch (error) {
      state.error = 'Failed to create SSE connection'
      console.error('SSE creation error:', error)
    }
  }

  const scheduleReconnect = () => {
    if (state.reconnecting) return

    state.reconnecting = true
    setTimeout(() => {
      if (eventSource.value?.readyState === EventSource.CLOSED) {
        connect()
      }
    }, 3000) // Reconnect after 3 seconds
  }

  const disconnect = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    state.connected = false
  }

  const getEventsByType = (type: string) => {
    return events.value.filter(event => event.type === type)
  }

  const clearEvents = () => {
    events.value = []
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    events,
    state,
    connect,
    disconnect,
    getEventsByType,
    clearEvents
  }
}
```

#### Real-Time Photo Gallery Component

```vue
<!-- src/components/Gallery/RealTimeGallery.vue -->
<template>
  <div class="real-time-gallery">
    <!-- Connection Status -->
    <div class="fixed top-4 right-4 z-50">
      <div 
        class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium"
        :class="connectionStatusClass"
      >
        <div 
          class="w-2 h-2 rounded-full"
          :class="connectionDotClass"
        ></div>
        <span>{{ connectionStatus }}</span>
      </div>
    </div>

    <!-- Photo Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TransitionGroup name="photo" tag="div" class="contents">
        <div
          v-for="photo in photos"
          :key="photo.documentId"
          class="photo-card group relative cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
          @click="openLightbox(photo)"
        >
          <img
            :src="getPhotoUrl(photo)"
            :alt="photo.image.alternativeText || photo.title"
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          
          <!-- Real-time Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
            <!-- Like Button -->
            <button
              @click.stop="toggleLike(photo.documentId)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
              :class="{ 'text-red-500': isLiked(photo.documentId), 'text-gray-600': !isLiked(photo.documentId) }"
            >
              <HeartIcon class="w-5 h-5" :filled="isLiked(photo.documentId)" />
            </button>

            <!-- Real-time Stats -->
            <div class="absolute bottom-3 left-3 right-3 text-white">
              <div class="flex justify-between items-end">
                <div>
                  <h3 class="font-semibold">{{ photo.title }}</h3>
                  <p class="text-xs opacity-75">{{ photo.category }}</p>
                </div>
                <div class="text-right text-xs">
                  <div class="flex items-center space-x-1">
                    <HeartIcon class="w-3 h-3" />
                    <span>{{ getLikeCount(photo.documentId) }}</span>
                  </div>
                  <div class="flex items-center space-x-1 mt-1">
                    <EyeIcon class="w-3 h-3" />
                    <span>{{ getViewCount(photo.documentId) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Real-time Notifications -->
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs"
        >
          {{ notification.message }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useServerSentEvents } from '@/composables/useServerSentEvents'
import { useAuthStore } from '@/stores/auth'
import type { Photo } from '@/types/gallery'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const authStore = useAuthStore()
const photos = ref<Photo[]>([])
const userLikes = ref<Set<string>>(new Set())
const photoStats = reactive<Record<string, { likes: number; views: number }>>({})
const notifications = ref<Notification[]>([])

// WebSocket for bi-directional communication
const { state: wsState, emit: wsEmit, on: wsOn } = useWebSocket(
  undefined,
  authStore.token
)

// SSE for live updates
const { events: sseEvents, state: sseState } = useServerSentEvents(
  `${import.meta.env.VITE_STRAPI_URL}/api/events/stream`
)

// Connection status
const connectionStatus = computed(() => {
  if (wsState.reconnecting) return 'Reconnecting...'
  if (wsState.connected && sseState.connected) return 'Live'
  if (wsState.connected || sseState.connected) return 'Partial'
  return 'Offline'
})

const connectionStatusClass = computed(() => ({
  'bg-green-500 text-white': connectionStatus.value === 'Live',
  'bg-yellow-500 text-white': connectionStatus.value === 'Partial',
  'bg-red-500 text-white': connectionStatus.value === 'Offline',
  'bg-blue-500 text-white': connectionStatus.value === 'Reconnecting...'
}))

const connectionDotClass = computed(() => ({
  'bg-white animate-pulse': wsState.reconnecting,
  'bg-white': !wsState.reconnecting
}))

// Photo interactions
const toggleLike = (photoId: string) => {
  wsEmit('photo:like', { photoId })
}

const isLiked = (photoId: string) => {
  return userLikes.value.has(photoId)
}

const getLikeCount = (photoId: string) => {
  return photoStats[photoId]?.likes || 0
}

const getViewCount = (photoId: string) => {
  return photoStats[photoId]?.views || 0
}

const openLightbox = (photo: Photo) => {
  // Track view
  wsEmit('photo:view', { photoId: photo.documentId })
  
  // Open lightbox logic here
}

const getPhotoUrl = (photo: Photo) => {
  const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
  return `${baseUrl}${photo.image.formats?.medium?.url || photo.image.url}`
}

const addNotification = (message: string, type: Notification['type'] = 'info') => {
  const notification: Notification = {
    id: Date.now().toString(),
    message,
    type
  }
  
  notifications.value.push(notification)
  
  // Remove after 5 seconds
  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === notification.id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }, 5000)
}

// WebSocket event listeners
onMounted(() => {
  // Photo like events
  wsOn('photo:liked', (data) => {
    userLikes.value.add(data.photoId)
    if (photoStats[data.photoId]) {
      photoStats[data.photoId].likes = data.likeCount
    }
  })

  wsOn('photo:unliked', (data) => {
    userLikes.value.delete(data.photoId)
    if (photoStats[data.photoId]) {
      photoStats[data.photoId].likes = data.likeCount
    }
  })

  wsOn('photo:like-update', (data) => {
    if (photoStats[data.photoId]) {
      photoStats[data.photoId].likes = data.likeCount
    }
  })

  wsOn('photo:view-update', (data) => {
    if (photoStats[data.photoId]) {
      photoStats[data.photoId].views = data.viewCount
    }
  })

  wsOn('gallery:new-photo', (data) => {
    photos.value.unshift(data.photo)
    addNotification('New photo added to gallery!', 'success')
  })

  wsOn('photo:updated', (data) => {
    const index = photos.value.findIndex(p => p.documentId === data.photoId)
    if (index > -1) {
      photos.value[index] = { ...photos.value[index], ...data.data }
    }
  })

  wsOn('photo:deleted', (data) => {
    const index = photos.value.findIndex(p => p.documentId === data.photoId)
    if (index > -1) {
      photos.value.splice(index, 1)
    }
  })

  wsOn('error', (error) => {
    addNotification(error.message, 'error')
  })
})

// Load initial data
const loadPhotos = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/photos?populate=*`)
    const data = await response.json()
    photos.value = data.data

    // Initialize stats
    data.data.forEach((photo: Photo) => {
      photoStats[photo.documentId] = {
        likes: photo.likeCount || 0,
        views: photo.viewCount || 0
      }
    })
  } catch (error) {
    addNotification('Failed to load photos', 'error')
  }
}

onMounted(() => {
  loadPhotos()
})
</script>

<style scoped>
/* Photo grid animations */
.photo-enter-active {
  transition: all 0.5s ease;
}

.photo-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}

.photo-leave-active {
  transition: all 0.3s ease;
}

.photo-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Notification animations */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
```

### TDD for Real-Time Features

#### Testing WebSocket Composables

```typescript
// tests/composables/useWebSocket.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useWebSocket } from '@/composables/useWebSocket'

// Mock Socket.IO
const mockSocket = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  emit: vi.fn(),
  on: vi.fn(),
  off: vi.fn()
}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket)
}))

const TestComponent = {
  template: '<div></div>',
  setup() {
    return useWebSocket('http://localhost:1337', 'mock-token')
  }
}

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Connection Management', () => {
    it('should initialize socket connection on mount', () => {
      mount(TestComponent)
      expect(mockSocket.connect).toHaveBeenCalled()
    })

    it('should handle connection events', () => {
      const wrapper = mount(TestComponent)
      const { state } = wrapper.vm

      // Simulate connection
      const connectHandler = mockSocket.on.mock.calls.find(
        call => call[0] === 'connect'
      )[1]
      connectHandler()

      expect(state.connected).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle connection errors', () => {
      const wrapper = mount(TestComponent)
      const { state } = wrapper.vm

      // Simulate error
      const errorHandler = mockSocket.on.mock.calls.find(
        call => call[0] === 'connect_error'
      )[1]
      errorHandler(new Error('Connection failed'))

      expect(state.error).toBe('Connection failed')
      expect(state.reconnectAttempts).toBe(1)
    })

    it('should disconnect on unmount', () => {
      const wrapper = mount(TestComponent)
      wrapper.unmount()
      expect(mockSocket.disconnect).toHaveBeenCalled()
    })
  })

  describe('Event Handling', () => {
    it('should emit events when connected', () => {
      const wrapper = mount(TestComponent)
      const { emit, state } = wrapper.vm

      // Simulate connection
      state.connected = true
      emit('test:event', { data: 'test' })

      expect(mockSocket.emit).toHaveBeenCalledWith('test:event', { data: 'test' })
    })

    it('should not emit events when disconnected', () => {
      const wrapper = mount(TestComponent)
      const { emit, state } = wrapper.vm

      state.connected = false
      emit('test:event', { data: 'test' })

      expect(mockSocket.emit).not.toHaveBeenCalled()
    })

    it('should register event listeners', () => {
      const wrapper = mount(TestComponent)
      const { on } = wrapper.vm
      const callback = vi.fn()

      on('test:event', callback)

      expect(mockSocket.on).toHaveBeenCalledWith('test:event', callback)
    })
  })
})
```

#### Testing Real-Time Photo Interactions

```typescript
// tests/components/RealTimeGallery.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import RealTimeGallery from '@/components/Gallery/RealTimeGallery.vue'
import { createPinia } from 'pinia'

// Mock WebSocket composable
const mockWsEmit = vi.fn()
const mockWsOn = vi.fn()

vi.mock('@/composables/useWebSocket', () => ({
  useWebSocket: () => ({
    state: { connected: true, error: null, reconnecting: false },
    emit: mockWsEmit,
    on: mockWsOn
  })
}))

// Mock SSE composable
vi.mock('@/composables/useServerSentEvents', () => ({
  useServerSentEvents: () => ({
    events: [],
    state: { connected: true, error: null }
  })
}))

const mockPhotos = [
  {
    documentId: '1',
    title: 'Test Photo',
    category: 'landscape',
    image: {
      url: '/test.jpg',
      alternativeText: 'Test photo',
      formats: {
        medium: { url: '/test-medium.jpg' }
      }
    }
  }
]

describe('RealTimeGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch for initial photo loading
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: mockPhotos })
      })
    ) as any
  })

  it('should display connection status', async () => {
    render(RealTimeGallery, {
      global: { plugins: [createPinia()] }
    })

    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('should emit like event when heart button is clicked', async () => {
    const user = userEvent.setup()
    render(RealTimeGallery, {
      global: { plugins: [createPinia()] }
    })

    await screen.findByText('Test Photo')
    
    const likeButton = screen.getByRole('button', { name: /heart/i })
    await user.click(likeButton)

    expect(mockWsEmit).toHaveBeenCalledWith('photo:like', { photoId: '1' })
  })

  it('should emit view event when photo is clicked', async () => {
    const user = userEvent.setup()
    render(RealTimeGallery, {
      global: { plugins: [createPinia()] }
    })

    await screen.findByText('Test Photo')
    
    const photoCard = screen.getByRole('img')
    await user.click(photoCard.parentElement!)

    expect(mockWsEmit).toHaveBeenCalledWith('photo:view', { photoId: '1' })
  })

  it('should register WebSocket event listeners', () => {
    render(RealTimeGallery, {
      global: { plugins: [createPinia()] }
    })

    // Check that event listeners were registered
    expect(mockWsOn).toHaveBeenCalledWith('photo:liked', expect.any(Function))
    expect(mockWsOn).toHaveBeenCalledWith('photo:unliked', expect.any(Function))
    expect(mockWsOn).toHaveBeenCalledWith('gallery:new-photo', expect.any(Function))
  })

  it('should handle real-time like updates', async () => {
    render(RealTimeGallery, {
      global: { plugins: [createPinia()] }
    })

    // Simulate receiving a like update
    const likeHandler = mockWsOn.mock.calls.find(
      call => call[0] === 'photo:like-update'
    )?.[1]

    if (likeHandler) {
      likeHandler({ photoId: '1', likeCount: 5 })
    }

    await screen.findByText('5') // Like count should update
  })
})
```

### Performance Optimization for Real-Time Features

#### Connection Pooling and Throttling

```typescript
// src/utils/realTimeOptimization.ts
export class ConnectionManager {
  private static instance: ConnectionManager
  private connections = new Map<string, any>()
  private eventQueue = new Map<string, any[]>()
  private throttleTimers = new Map<string, number>()

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager()
    }
    return ConnectionManager.instance
  }

  // Throttle events to prevent spam
  throttleEvent(eventName: string, data: any, delay = 100) {
    const key = `${eventName}-${JSON.stringify(data)}`
    
    if (this.throttleTimers.has(key)) {
      clearTimeout(this.throttleTimers.get(key)!)
    }

    const timer = setTimeout(() => {
      this.emitEvent(eventName, data)
      this.throttleTimers.delete(key)
    }, delay)

    this.throttleTimers.set(key, timer)
  }

  // Batch events for efficiency
  batchEvents(events: Array<{ name: string; data: any }>) {
    const batched = new Map<string, any[]>()
    
    events.forEach(({ name, data }) => {
      if (!batched.has(name)) {
        batched.set(name, [])
      }
      batched.get(name)!.push(data)
    })

    batched.forEach((dataArray, eventName) => {
      this.emitEvent(`${eventName}:batch`, dataArray)
    })
  }

  private emitEvent(eventName: string, data: any) {
    // Implementation depends on your WebSocket setup
    console.log('Emitting event:', eventName, data)
  }
}
```

#### Optimized Real-Time Store

```typescript
// src/stores/realTime.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ConnectionManager } from '@/utils/realTimeOptimization'

export const useRealTimeStore = defineStore('realTime', () => {
  const connectionManager = ConnectionManager.getInstance()
  
  // Real-time data
  const photoStats = ref<Record<string, { likes: number; views: number }>>({})
  const onlineUsers = ref<string[]>([])
  const recentActivity = ref<Array<{ type: string; data: any; timestamp: Date }>>([])

  // Computed properties
  const totalLikes = computed(() => {
    return Object.values(photoStats.value).reduce((total, stats) => total + stats.likes, 0)
  })

  const totalViews = computed(() => {
    return Object.values(photoStats.value).reduce((total, stats) => total + stats.views, 0)
  })

  // Actions
  const updatePhotoStats = (photoId: string, updates: Partial<{ likes: number; views: number }>) => {
    if (!photoStats.value[photoId]) {
      photoStats.value[photoId] = { likes: 0, views: 0 }
    }
    Object.assign(photoStats.value[photoId], updates)
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

  const throttledLike = (photoId: string) => {
    connectionManager.throttleEvent('photo:like', { photoId }, 500)
  }

  return {
    photoStats,
    onlineUsers,
    recentActivity,
    totalLikes,
    totalViews,
    updatePhotoStats,
    addActivity,
    throttledLike
  }
})
```

## Deployment Configuration

### Multi-Environment Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  strapi:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "1337:1337"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/portfolio
    command: npm start
    depends_on:
      - db
      - redis

  frontend:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    environment:
      - VITE_STRAPI_URL=http://strapi:1337
    command: npm run preview

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Portfolio

on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd frontend && npm run test
          cd ../backend && npm run test
      
      - name: TypeScript check
        run: cd frontend && npm run type-check
      
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: frontend/dist/

  deploy:
    needs: test-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Strapi Cloud
        run: |
          cd backend
          npx strapi deploy
        env:
          STRAPI_TOKEN: ${{ secrets.STRAPI_TOKEN }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Security and Performance Best Practices

### Environment Configuration

```bash
# .env.production
NODE_ENV=production
VITE_STRAPI_URL=https://your-strapi-api.com
VITE_CDN_URL=https://your-cdn.com

# Strapi backend .env
DATABASE_URL=postgresql://user:pass@host:port/db
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=your-admin-secret
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Third-party services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Performance Monitoring

```typescript
// composables/usePerformanceMonitoring.ts
import { onMounted } from 'vue'

export function usePerformanceMonitoring() {
  const trackCoreWebVitals = () => {
    // Track Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      // Send to analytics
      sendMetric('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })
    
    // Track First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        sendMetric('FID', entry.processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })
    
    // Track Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      sendMetric('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }
  
  const sendMetric = (name: string, value: number) => {
    // Send to your analytics service
    console.log(`${name}: ${value}`)
  }
  
  onMounted(() => {
    trackCoreWebVitals()
  })
}
```

This comprehensive implementation guide provides everything needed to build a modern, high-performance photography portfolio using the latest versions of Vue 3, Tailwind CSS v4, and Strapi v5. The setup emphasizes developer experience, performance optimization, and production readiness with modern deployment strategies and monitoring capabilities.

## Test-Driven Development (TDD) with Vitest

### Why TDD for Photography Portfolio?

Test-Driven Development ensures robust, maintainable code by writing tests before implementation. For a photography portfolio, TDD provides:

- **Reliability**: Critical user interactions (image loading, filtering, likes) work consistently
- **Refactoring Confidence**: Safe code improvements without breaking functionality  
- **Component Contracts**: Clear specifications for component behavior
- **Bug Prevention**: Catch issues before they reach production

### TDD Workflow: Red-Green-Refactor

```mermaid
graph LR
    A[🔴 RED: Write Failing Test] --> B[🟢 GREEN: Make Test Pass]
    B --> C[🔵 REFACTOR: Improve Code]
    C --> A
```

### Modern Vitest Setup

#### Installation and Configuration

```bash
# Install Vitest and testing utilities
npm install -D vitest @vue/test-utils jsdom @vitest/ui
npm install -D @testing-library/vue @testing-library/jest-dom
npm install -D @testing-library/user-event happy-dom
```

#### Updated package.json with TDD scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "tdd": "vitest --watch --reporter=verbose"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/user-event": "^14.5.1",
    "@testing-library/vue": "^8.0.1",
    "@vitest/coverage-v8": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@vue/test-utils": "^2.4.1",
    "happy-dom": "^12.10.3",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.0"
  }
}
```

#### Optimized Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  test: {
    // Use happy-dom for better performance over jsdom
    environment: 'happy-dom',
    
    // Global test setup
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{js,ts}',
        'src/**/*.spec.{js,ts}',
        'src/main.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Performance optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
})
```

#### Global Test Setup

```typescript
// tests/setup.ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver for image lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### TDD Example: Photo Card Component

Let's build a `PhotoCard` component using TDD principles:

#### Step 1: Define Requirements

```typescript
// tests/PhotoCard.requirements.md
/**
 * PhotoCard Component Requirements:
 * 
 * 1. Display photo with title, description, and metadata
 * 2. Show loading state while image loads
 * 3. Handle like/unlike functionality
 * 4. Support lazy loading for performance
 * 5. Emit click events for lightbox
 * 6. Handle image load errors gracefully
 * 7. Display hover overlay with actions
 */
```

#### Step 2: RED - Write Failing Tests

```typescript
// tests/components/PhotoCard.test.ts
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
      
      expect(screen.getByRole('img')).toHaveAttribute('alt', mockPhoto.image.alternativeText)
      expect(screen.getByText(mockPhoto.title)).toBeInTheDocument()
    })

    it('should display loading state initially', () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      expect(screen.getByTestId('photo-skeleton')).toBeInTheDocument()
    })

    it('should show description on hover', async () => {
      const user = userEvent.setup()
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const card = screen.getByTestId('photo-card')
      await user.hover(card)
      
      expect(screen.getByText(mockPhoto.description)).toBeInTheDocument()
    })
  })

  describe('Like Functionality', () => {
    it('should emit like event when heart button is clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const likeButton = screen.getByRole('button', { name: /like photo/i })
      await user.click(likeButton)
      
      expect(emitted()).toHaveProperty('like')
    })

    it('should show filled heart when photo is liked', () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: true }
      })
      
      const likeButton = screen.getByRole('button', { name: /unlike photo/i })
      expect(likeButton).toHaveClass('text-red-500')
    })
  })

  describe('Image Loading', () => {
    it('should handle image load success', async () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const image = screen.getByRole('img')
      await fireEvent.load(image)
      
      expect(screen.queryByTestId('photo-skeleton')).not.toBeInTheDocument()
      expect(image).toHaveClass('opacity-100')
    })

    it('should handle image load error', async () => {
      render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const image = screen.getByRole('img')
      await fireEvent.error(image)
      
      expect(screen.getByText('Failed to load image')).toBeInTheDocument()
    })
  })

  describe('Click Events', () => {
    it('should emit click event when card is clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const card = screen.getByTestId('photo-card')
      await user.click(card)
      
      expect(emitted()).toHaveProperty('click')
    })

    it('should not emit click when like button is clicked', async () => {
      const user = userEvent.setup()
      const { emitted } = render(PhotoCard, {
        props: { photo: mockPhoto, isLiked: false }
      })
      
      const likeButton = screen.getByRole('button', { name: /like photo/i })
      await user.click(likeButton)
      
      expect(emitted()).not.toHaveProperty('click')
      expect(emitted()).toHaveProperty('like')
    })
  })
})
```

#### Step 3: GREEN - Make Tests Pass

```vue
<!-- src/components/Gallery/PhotoCard.vue -->
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
        <div class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    
    <!-- Main image -->
    <picture v-if="!imageError">
      <source :srcset="generateSrcSet('avif')" type="image/avif" />
      <source :srcset="generateSrcSet('webp')" type="image/webp" />
      <img
        :src="imageSource"
        :alt="photo.image.alternativeText || photo.title"
        :loading="lazy ? 'lazy' : 'eager'"
        class="w-full h-auto transition-opacity duration-300"
        :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
        :style="{ aspectRatio: `${photo.image.width || 16}/${photo.image.height || 9}` }"
      />
    </picture>
    
    <!-- Error state -->
    <div v-if="imageError" class="flex items-center justify-center h-48 bg-gray-200">
      <span class="text-gray-500">Failed to load image</span>
    </div>
    
    <!-- Hover overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
      <!-- Like button -->
      <div class="absolute top-3 right-3 z-10">
        <button
          :aria-label="isLiked ? 'Unlike photo' : 'Like photo'"
          class="p-2 rounded-full bg-white bg-opacity-80 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-100"
          :class="[
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-600 hover:text-red-400'
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
            <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      
      <!-- Info overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 class="font-semibold text-sm truncate mb-1">
          {{ photo.title }}
        </h3>
        <p v-if="photo.description" class="text-xs opacity-80 mb-1">
          {{ photo.description }}
        </p>
        <div v-if="photo.category" class="text-xs opacity-80">
          {{ photo.category }}
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
  lazy?: boolean
}

interface Emits {
  (e: 'click'): void
  (e: 'like'): void
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true
})

const emit = defineEmits<Emits>()

const imageLoaded = ref(false)
const imageError = ref(false)
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

const imageSource = computed(() => {
  if (props.photo.image.formats?.thumbnail) {
    return `${STRAPI_URL}${props.photo.image.formats.thumbnail.url}`
  }
  return `${STRAPI_URL}${props.photo.image.url}`
})

const generateSrcSet = (format: 'avif' | 'webp') => {
  const baseUrl = props.photo.image.url.replace(/\.[^/.]+$/, '')
  return `${STRAPI_URL}${baseUrl}.${format}`
}

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
```

#### Step 4: REFACTOR - Improve Implementation

```vue
<!-- Refactored PhotoCard.vue with better performance and accessibility -->
<template>
  <article 
    data-testid="photo-card"
    class="photo-card group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500"
    @click="handleCardClick"
    @keydown.enter="handleCardClick"
    @keydown.space.prevent="handleCardClick"
    tabindex="0"
    :aria-label="`View ${photo.title} in lightbox`"
  >
    <!-- Loading skeleton with better aspect ratio handling -->
    <PhotoSkeleton 
      v-if="!imageLoaded && !imageError"
      :width="photo.image.width"
      :height="photo.image.height"
    />
    
    <!-- Optimized image with responsive loading -->
    <ResponsiveImage
      v-if="!imageError"
      :photo="photo"
      :lazy="lazy"
      @load="handleImageLoad"
      @error="handleImageError"
      :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }"
    />
    
    <!-- Error state with retry option -->
    <ImageError v-if="imageError" @retry="retryImageLoad" />
    
    <!-- Interactive overlay -->
    <PhotoOverlay
      :photo="photo"
      :is-liked="isLiked"
      @like="handleLikeClick"
    />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhotoSkeleton from './PhotoSkeleton.vue'
import ResponsiveImage from './ResponsiveImage.vue'
import ImageError from './ImageError.vue'
import PhotoOverlay from './PhotoOverlay.vue'
import type { Photo } from '@/types/gallery'

interface Props {
  photo: Photo
  isLiked: boolean
  lazy?: boolean
}

interface Emits {
  (e: 'click'): void
  (e: 'like'): void
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true
})

const emit = defineEmits<Emits>()

const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}

const retryImageLoad = () => {
  imageError.value = false
  imageLoaded.value = false
}

const handleCardClick = () => {
  emit('click')
}

const handleLikeClick = () => {
  emit('like')
}
</script>
```

### TDD for Composables

#### Testing usePhotos Composable

```typescript
// tests/composables/usePhotos.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { usePhotos } from '@/composables/usePhotos'

// Mock fetch globally
global.fetch = vi.fn()

const mockPhotosResponse = {
  data: [
    {
      documentId: '1',
      title: 'Test Photo',
      image: { url: '/test.jpg', alternativeText: 'Test' },
      category: 'landscape',
      featured: true
    }
  ]
}

// Test component wrapper for composable testing
const TestComponent = {
  template: '<div></div>',
  setup() {
    return usePhotos()
  }
}

describe('usePhotos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty photos array', () => {
      const wrapper = mount(TestComponent)
      const { photos, loading, error } = wrapper.vm
      
      expect(photos).toEqual([])
      expect(loading).toBe(false)
      expect(error).toBe(null)
    })
  })

  describe('fetchPhotos', () => {
    it('should set loading state during fetch', async () => {
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockPhotosResponse)
        }), 100))
      )

      const wrapper = mount(TestComponent)
      const { fetchPhotos, loading } = wrapper.vm
      
      const fetchPromise = fetchPhotos()
      expect(loading).toBe(true)
      
      await fetchPromise
      expect(loading).toBe(false)
    })

    it('should update photos on successful fetch', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPhotosResponse)
      })

      const wrapper = mount(TestComponent)
      const { fetchPhotos, photos } = wrapper.vm
      
      await fetchPhotos()
      
      expect(photos).toEqual(mockPhotosResponse.data)
    })

    it('should handle fetch errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const wrapper = mount(TestComponent)
      const { fetchPhotos, error, photos } = wrapper.vm
      
      await fetchPhotos()
      
      expect(error).toBe('Failed to fetch photos')
      expect(photos).toEqual([])
    })
  })

  describe('Computed Properties', () => {
    it('should filter featured photos correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [
            { ...mockPhotosResponse.data[0], featured: true },
            { ...mockPhotosResponse.data[0], documentId: '2', featured: false }
          ]
        })
      })

      const wrapper = mount(TestComponent)
      const { fetchPhotos, featuredPhotos } = wrapper.vm
      
      await fetchPhotos()
      
      expect(featuredPhotos).toHaveLength(1)
      expect(featuredPhotos[0].featured).toBe(true)
    })
  })
})
```

### Integration Testing

#### Testing Gallery with Photo Cards

```typescript
// tests/integration/Gallery.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Gallery from '@/components/Gallery/Gallery.vue'
import { createPinia } from 'pinia'

// Mock the Strapi service
vi.mock('@/services/strapi', () => ({
  strapiService: {
    getPortfolio: vi.fn(() => Promise.resolve([
      {
        documentId: '1',
        title: 'Mountain View',
        image: { url: '/mountain.jpg', alternativeText: 'Mountain' },
        category: 'landscape',
        featured: true
      },
      {
        documentId: '2', 
        title: 'City Lights',
        image: { url: '/city.jpg', alternativeText: 'City' },
        category: 'urban',
        featured: false
      }
    ]))
  }
}))

describe('Gallery Integration', () => {
  const renderGallery = () => {
    return render(Gallery, {
      global: {
        plugins: [createPinia()]
      }
    })
  }

  it('should load and display photos from API', async () => {
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText('Mountain View')).toBeInTheDocument()
      expect(screen.getByText('City Lights')).toBeInTheDocument()
    })
  })

  it('should filter photos by category', async () => {
    const user = userEvent.setup()
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText('Mountain View')).toBeInTheDocument()
    })
    
    const landscapeFilter = screen.getByRole('button', { name: /landscape/i })
    await user.click(landscapeFilter)
    
    expect(screen.getByText('Mountain View')).toBeInTheDocument()
    expect(screen.queryByText('City Lights')).not.toBeInTheDocument()
  })

  it('should open lightbox when photo is clicked', async () => {
    const user = userEvent.setup()
    renderGallery()
    
    await waitFor(() => {
      expect(screen.getByText('Mountain View')).toBeInTheDocument()
    })
    
    const photoCard = screen.getByTestId('photo-card')
    await user.click(photoCard)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /mountain/i })).toBeInTheDocument()
  })
})
```

### Performance Testing

```typescript
// tests/performance/ImageLoading.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import PhotoCard from '@/components/Gallery/PhotoCard.vue'

describe('Image Loading Performance', () => {
  it('should implement lazy loading for off-screen images', async () => {
    const intersectionObserverMock = vi.fn()
    const mockObserve = vi.fn()
    const mockUnobserve = vi.fn()

    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: vi.fn()
    }))

    render(PhotoCard, {
      props: {
        photo: {
          documentId: '1',
          title: 'Test',
          image: { url: '/test.jpg', alternativeText: 'Test' }
        },
        isLiked: false,
        lazy: true
      }
    })

    expect(mockObserve).toHaveBeenCalled()
  })

  it('should preload critical images', () => {
    render(PhotoCard, {
      props: {
        photo: {
          documentId: '1',
          title: 'Hero Image',
          image: { url: '/hero.jpg', alternativeText: 'Hero' }
        },
        isLiked: false,
        lazy: false // Critical image
      }
    })

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('loading', 'eager')
  })
})
```

### E2E Testing with Cypress (Optional)

```typescript
// cypress/e2e/portfolio.cy.ts
describe('Photography Portfolio E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display portfolio gallery', () => {
    cy.get('[data-testid="photo-card"]').should('be.visible')
    cy.get('[data-testid="photo-card"]').should('have.length.greaterThan', 0)
  })

  it('should filter photos by category', () => {
    cy.get('[data-testid="filter-landscape"]').click()
    cy.get('[data-testid="photo-card"]').each($card => {
      cy.wrap($card).should('contain.attr', 'data-category', 'landscape')
    })
  })

  it('should open lightbox on photo click', () => {
    cy.get('[data-testid="photo-card"]').first().click()
    cy.get('[data-testid="lightbox"]').should('be.visible')
    cy.get('[data-testid="lightbox-close"]').click()
    cy.get('[data-testid="lightbox"]').should('not.exist')
  })

  it('should like/unlike photos', () => {
    cy.get('[data-testid="like-button"]').first().click()
    cy.get('[data-testid="like-button"]').first().should('have.class', 'text-red-500')
    
    cy.get('[data-testid="like-button"]').first().click()
    cy.get('[data-testid="like-button"]').first().should('not.have.class', 'text-red-500')
  })
})
```

### TDD Development Workflow

#### Daily TDD Workflow for Photography Portfolio

```bash
# 1. Start TDD session
npm run tdd

# 2. Create feature branch
git checkout -b feature/photo-filter-component

# 3. Write failing test first
# tests/components/PhotoFilter.test.ts

# 4. Watch test fail (RED)
# 5. Write minimal code to pass (GREEN) 
# 6. Refactor code (REFACTOR)
# 7. Commit when tests pass

git add .
git commit -m "feat: add photo filter component with TDD"

# 8. Repeat cycle for next feature
```

#### Test Organization Structure

```
tests/
├── setup.ts                     # Global test configuration
├── components/                  # Component unit tests
│   ├── Gallery/
│   │   ├── PhotoCard.test.ts
│   │   ├── Gallery.test.ts
│   │   ├── Lightbox.test.ts
│   │   └── FilterBar.test.ts
│   └── Layout/
│       ├── Header.test.ts
│       └── Navigation.test.ts
├── composables/                 # Composable unit tests
│   ├── usePhotos.test.ts
│   ├── useLikes.test.ts
│   └── useAnimation.test.ts
├── stores/                      # Store unit tests
│   ├── gallery.test.ts
│   └── likes.test.ts
├── integration/                 # Integration tests
│   ├── Gallery.test.ts
│   └── Portfolio.test.ts
├── e2e/                        # End-to-end tests
│   └── portfolio.cy.ts
└── __mocks__/                  # Test mocks
    ├── strapi.ts
    └── intersectionObserver.ts
```

### Visual Regression Testing

```typescript
// tests/visual/PhotoCard.test.ts
import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import PhotoCard from '@/components/Gallery/PhotoCard.vue'

expect.extend({ toMatchImageSnapshot })

describe('PhotoCard Visual Tests', () => {
  it('should match visual snapshot', async () => {
    const { container } = render(PhotoCard, {
      props: {
        photo: mockPhoto,
        isLiked: false
      }
    })

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: 'photo-card-default'
    })
  })

  it('should match liked state snapshot', async () => {
    const { container } = render(PhotoCard, {
      props: {
        photo: mockPhoto,
        isLiked: true
      }
    })

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: 'photo-card-liked'
    })
  })
})
```

### Continuous Integration Testing

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:run
      
      - name: Run coverage
        run: npm run test:coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
      
      - name: Run E2E tests
        run: |
          npm run build
          npm run test:e2e:headless
```

This comprehensive TDD approach ensures your photography portfolio is robust, maintainable, and thoroughly tested. The combination of Vitest's speed, Vue Test Utils' component testing capabilities, and systematic TDD practices will result in high-quality, reliable code that's easy to refactor and extend.