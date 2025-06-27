# Vue.js Photography Portfolio: Modern Implementation Guide

An updated comprehensive implementation plan using **Tailwind CSS v4**, **Supabase** (open source), **Vue 3**, and **pnpm** for cutting-edge development practices and production-ready configurations.

## Prerequisites

Before starting, ensure you have **pnpm** installed for faster, more efficient package management:

```bash
# Install pnpm globally
npm install -g pnpm

# Or using corepack (recommended for Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# Verify installation
pnpm --version
```

**Why pnpm?**
- **2x faster installs** compared to npm
- **Efficient disk usage** with symlinked dependencies
- **Strict dependency resolution** prevents phantom dependencies
- **Better monorepo support** for complex projects

## Technology Stack Revolution

The modern photography portfolio implementation leverages cutting-edge open source technologies. **Tailwind CSS v4** introduces a revolutionary Rust-powered "Oxide" engine delivering **5x faster full builds** and **100x faster incremental builds**. **Supabase** provides a fully open source PostgreSQL backend with built-in real-time subscriptions, authentication, and storage. **Vue 3** provides the reactive foundation with Composition API patterns optimized for modern development workflows.

This stack combination eliminates traditional configuration complexity while delivering unprecedented performance. Tailwind v4's CSS-first approach replaces JavaScript configuration files with native CSS, Supabase's PostgreSQL architecture provides enterprise-grade database features, and Vue 3's Composition API enables cleaner, more maintainable code patterns.

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

## Supabase Open Source Backend

### Why Supabase for Photography Portfolio?

Supabase provides the perfect open source backend offering:

- ✅ **Fully Open Source** - MIT licensed, self-hostable PostgreSQL
- ✅ **Real-time Subscriptions** - Built-in WebSocket support
- ✅ **Storage API** - Optimized image handling with CDN
- ✅ **Edge Functions** - Serverless Deno runtime for image processing
- ✅ **Built-in Auth** - JWT-based authentication with social providers
- ✅ **Auto-generated APIs** - REST and GraphQL endpoints
- ✅ **Row Level Security** - PostgreSQL RLS for data protection
- ✅ **TypeScript Support** - Auto-generated types from database schema

### Database Schema Setup

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE photo_category AS ENUM (
  'portrait', 'landscape', 'street', 'wildlife', 'macro', 'wedding', 'event'
);

-- Photographers table
CREATE TABLE photographers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  image_metadata JSONB DEFAULT '{}', -- width, height, format, size
  thumbnail_url TEXT,
  category photo_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  
  -- Camera settings
  camera_settings JSONB DEFAULT '{}', -- camera, lens, aperture, etc.
  
  -- Location data
  location TEXT,
  location_coordinates POINT,
  capture_date DATE,
  
  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- Relationships
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Galleries table
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery photos junction table
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, photo_id)
);

-- Likes table for user interactions
CREATE TABLE photo_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- Views table for analytics
CREATE TABLE photo_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE photo_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_featured ON photos(featured) WHERE featured = TRUE;
CREATE INDEX idx_photos_published ON photos(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_photos_photographer ON photos(photographer_id);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_views_photo_id ON photo_views(photo_id);
CREATE INDEX idx_gallery_photos_gallery ON gallery_photos(gallery_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photos_updated_at 
  BEFORE UPDATE ON photos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at 
  BEFORE UPDATE ON galleries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photographers_updated_at 
  BEFORE UPDATE ON photographers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

-- Photographers policies
CREATE POLICY "Photographers are viewable by everyone" 
  ON photographers FOR SELECT 
  USING (true);

CREATE POLICY "Photographers can update own profile" 
  ON photographers FOR UPDATE 
  USING (auth.uid() = id);

-- Photos policies
CREATE POLICY "Published photos are viewable by everyone" 
  ON photos FOR SELECT 
  USING (published_at IS NOT NULL);

CREATE POLICY "Photographers can manage own photos" 
  ON photos FOR ALL 
  USING (auth.uid() = photographer_id);

-- Galleries policies
CREATE POLICY "Public galleries are viewable by everyone" 
  ON galleries FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Photographers can manage own galleries" 
  ON galleries FOR ALL 
  USING (auth.uid() = photographer_id);

-- Gallery photos policies
CREATE POLICY "Gallery photos inherit gallery permissions" 
  ON gallery_photos FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM galleries 
      WHERE id = gallery_id AND is_public = true
    )
  );

-- Photo likes policies
CREATE POLICY "Anyone can view photo likes" 
  ON photo_likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage own likes" 
  ON photo_likes FOR ALL 
  USING (auth.uid() = user_id);

-- Anonymous users can also like (using IP)
CREATE POLICY "Anonymous users can like photos" 
  ON photo_likes FOR INSERT 
  WITH CHECK (
    auth.uid() IS NULL AND 
    ip_address IS NOT NULL
  );

-- Photo views policies (open for analytics)
CREATE POLICY "Anyone can view photo views" 
  ON photo_views FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert photo views" 
  ON photo_views FOR INSERT 
  WITH CHECK (true);

-- Comments policies
CREATE POLICY "Anyone can view approved comments" 
  ON photo_comments FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can manage own comments" 
  ON photo_comments FOR ALL 
  USING (auth.uid() = user_id);
```

### Database Functions

```sql
-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_photo_views(photo_uuid UUID, client_ip INET, client_user_agent TEXT DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  current_views INTEGER;
BEGIN
  -- Insert view record
  INSERT INTO photo_views (photo_id, ip_address, user_agent, user_id)
  VALUES (photo_uuid, client_ip, client_user_agent, auth.uid())
  ON CONFLICT DO NOTHING;
  
  -- Update photo view count
  UPDATE photos 
  SET view_count = view_count + 1 
  WHERE id = photo_uuid;
  
  -- Return updated count
  SELECT view_count INTO current_views 
  FROM photos 
  WHERE id = photo_uuid;
  
  RETURN current_views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle photo likes
CREATE OR REPLACE FUNCTION toggle_photo_like(photo_uuid UUID, client_ip INET DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  like_record RECORD;
  current_likes INTEGER;
  user_liked BOOLEAN := FALSE;
BEGIN
  -- Check if user already liked
  SELECT * INTO like_record 
  FROM photo_likes 
  WHERE photo_id = photo_uuid 
  AND (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND ip_address = client_ip)
  );
  
  IF FOUND THEN
    -- Unlike: remove the like
    DELETE FROM photo_likes WHERE id = like_record.id;
    user_liked := FALSE;
  ELSE
    -- Like: add the like
    INSERT INTO photo_likes (photo_id, user_id, ip_address)
    VALUES (photo_uuid, auth.uid(), client_ip);
    user_liked := TRUE;
  END IF;
  
  -- Update photo like count
  SELECT COUNT(*) INTO current_likes 
  FROM photo_likes 
  WHERE photo_id = photo_uuid;
  
  UPDATE photos 
  SET like_count = current_likes 
  WHERE id = photo_uuid;
  
  RETURN json_build_object(
    'liked', user_liked,
    'like_count', current_likes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get featured photos
CREATE OR REPLACE FUNCTION get_featured_photos(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  category photo_category,
  like_count INTEGER,
  view_count INTEGER,
  photographer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.image_url,
    p.thumbnail_url,
    p.category,
    p.like_count,
    p.view_count,
    ph.name as photographer_name,
    p.created_at
  FROM photos p
  LEFT JOIN photographers ph ON p.photographer_id = ph.id
  WHERE p.featured = TRUE 
  AND p.published_at IS NOT NULL
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Real-time Setup

Enable real-time on relevant tables:

```sql
-- Enable real-time for photos table
ALTER publication supabase_realtime ADD TABLE photos;
ALTER publication supabase_realtime ADD TABLE photo_likes;
ALTER publication supabase_realtime ADD TABLE photo_views;
ALTER publication supabase_realtime ADD TABLE photo_comments;
```

## Vue 3 Modern Integration Patterns

### Supabase Client Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Limit real-time events
    },
  },
})

// Storage helpers
export const getImageUrl = (path: string) => {
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}

export const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}
```

### Modern TypeScript Type Definitions

```typescript
// types/database.ts - Auto-generated from Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string
          title: string
          description: string | null
          slug: string
          image_url: string
          image_metadata: Json
          thumbnail_url: string | null
          category: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro' | 'wedding' | 'event'
          tags: string[]
          featured: boolean
          camera_settings: Json
          location: string | null
          location_coordinates: unknown | null
          capture_date: string | null
          view_count: number
          like_count: number
          photographer_id: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          slug: string
          image_url: string
          image_metadata?: Json
          thumbnail_url?: string | null
          category: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro' | 'wedding' | 'event'
          tags?: string[]
          featured?: boolean
          camera_settings?: Json
          location?: string | null
          location_coordinates?: unknown | null
          capture_date?: string | null
          view_count?: number
          like_count?: number
          photographer_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          slug?: string
          image_url?: string
          image_metadata?: Json
          thumbnail_url?: string | null
          category?: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro' | 'wedding' | 'event'
          tags?: string[]
          featured?: boolean
          camera_settings?: Json
          location?: string | null
          location_coordinates?: unknown | null
          capture_date?: string | null
          view_count?: number
          like_count?: number
          photographer_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      photographers: {
        Row: {
          id: string
          email: string
          name: string
          bio: string | null
          avatar_url: string | null
          website_url: string | null
          social_links: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          website_url?: string | null
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          website_url?: string | null
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_photo_views: {
        Args: {
          photo_uuid: string
          client_ip: unknown
          client_user_agent?: string
        }
        Returns: number
      }
      toggle_photo_like: {
        Args: {
          photo_uuid: string
          client_ip?: unknown
        }
        Returns: Json
      }
      get_featured_photos: {
        Args: {
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          image_url: string
          thumbnail_url: string
          category: string
          like_count: number
          view_count: number
          photographer_name: string
          created_at: string
        }[]
      }
    }
    Enums: {
      photo_category: 'portrait' | 'landscape' | 'street' | 'wildlife' | 'macro' | 'wedding' | 'event'
    }
  }
}

// Application types
export interface Photo {
  id: string
  title: string
  description?: string
  slug: string
  image_url: string
  thumbnail_url?: string
  category: Database['public']['Enums']['photo_category']
  tags: string[]
  featured: boolean
  camera_settings?: CameraSettings
  location?: string
  capture_date?: string
  view_count: number
  like_count: number
  photographer?: Photographer
  created_at: string
  updated_at: string
  published_at?: string
}

export interface CameraSettings {
  camera?: string
  lens?: string
  aperture?: string
  shutterSpeed?: string
  iso?: number
  focalLength?: string
}

export interface Photographer {
  id: string
  name: string
  bio?: string
  avatar_url?: string
  website_url?: string
}
```

### Composition API with Supabase Integration

```typescript
// composables/usePhotos.ts
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Photo } from '@/types/database'

export function usePhotos() {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPhotos = async (filters: {
    category?: string
    featured?: boolean
    limit?: number
    sort?: string
  } = {}) => {
    loading.value = true
    error.value = null
    
    try {
      let query = supabase
        .from('photos')
        .select(`
          *,
          photographer:photographers(name, avatar_url),
          galleries:gallery_photos(gallery_id)
        `)
        .not('published_at', 'is', null)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.featured) {
        query = query.eq('featured', true)
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      
      photos.value = data as Photo[]
      return data as Photo[]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch photos'
      throw err
    } finally {
      loading.value = false
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
    fetchPhotos
  }
}
```

### Real-Time Photo Service

```typescript
// services/photoService.ts
import { supabase } from '@/lib/supabase'
import type { Photo, PhotoFilters } from '@/types/photo'

export class PhotoService {
  static async getPhotos(filters: PhotoFilters = {}) {
    let query = supabase
      .from('photos')
      .select(`
        *,
        photographer:photographers(name, avatar_url),
        galleries:gallery_photos(gallery_id)
      `)
      .not('published_at', 'is', null)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.featured) {
      query = query.eq('featured', true)
    }
    
    if (filters.photographer_id) {
      query = query.eq('photographer_id', filters.photographer_id)
    }
    
    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Photo[]
  }

  static async getPhoto(id: string) {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        photographer:photographers(*),
        galleries:gallery_photos(
          gallery:galleries(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Photo
  }

  static async incrementViews(photoId: string) {
    const { data, error } = await supabase.rpc('increment_photo_views', {
      photo_uuid: photoId,
      client_ip: '192.168.1.1', // Get from request in production
      client_user_agent: navigator.userAgent
    })

    if (error) throw error
    return data
  }

  static async toggleLike(photoId: string) {
    const { data, error } = await supabase.rpc('toggle_photo_like', {
      photo_uuid: photoId,
      client_ip: '192.168.1.1' // Get from request in production
    })

    if (error) throw error
    return data
  }

  static async searchPhotos(searchTerm: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .not('published_at', 'is', null)
      .limit(20)

    if (error) throw error
    return data as Photo[]
  }
}
```

### State Management with Pinia

```typescript
// stores/portfolio.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PhotoService } from '@/services/photoService'
import type { Photo } from '@/types/database'

export const usePortfolioStore = defineStore('portfolio', () => {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
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

  const featuredPhotos = computed(() => {
    return photos.value.filter(photo => photo.featured)
  })
  
  const loadPortfolio = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const data = await PhotoService.getPhotos({
        ...filters,
        sort: 'created_at:desc'
      })
      photos.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load portfolio'
    } finally {
      loading.value = false
    }
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
    filteredPhotos,
    featuredPhotos,
    activeCategory: computed(() => activeCategory.value),
    searchQuery: computed(() => searchQuery.value),
    loadPortfolio,
    setCategory,
    setSearchQuery
  }
})
```

## Real-Time Architecture with Supabase

### Real-time Composable

```typescript
// src/composables/useRealtimePhotos.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Photo } from '@/types/database'

export function useRealtimePhotos() {
  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  let photosChannel: RealtimeChannel | null = null
  let likesChannel: RealtimeChannel | null = null

  const setupRealtimeSubscriptions = () => {
    // Subscribe to photo changes
    photosChannel = supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos'
        },
        (payload) => {
          console.log('Photo change:', payload)
          handlePhotoChange(payload)
        }
      )
      .subscribe()

    // Subscribe to like changes
    likesChannel = supabase
      .channel('likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photo_likes'
        },
        (payload) => {
          console.log('Like change:', payload)
          handleLikeChange(payload)
        }
      )
      .subscribe()
  }

  const handlePhotoChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        if (newRecord.published_at) {
          photos.value.unshift(newRecord)
        }
        break
      
      case 'UPDATE':
        const index = photos.value.findIndex(p => p.id === newRecord.id)
        if (index > -1) {
          photos.value[index] = { ...photos.value[index], ...newRecord }
        }
        break
      
      case 'DELETE':
        const deleteIndex = photos.value.findIndex(p => p.id === oldRecord.id)
        if (deleteIndex > -1) {
          photos.value.splice(deleteIndex, 1)
        }
        break
    }
  }

  const handleLikeChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    const photoId = newRecord?.photo_id || oldRecord?.photo_id

    if (!photoId) return

    // Update like count in photos array
    const photo = photos.value.find(p => p.id === photoId)
    if (photo) {
      if (eventType === 'INSERT') {
        photo.like_count++
      } else if (eventType === 'DELETE') {
        photo.like_count = Math.max(0, photo.like_count - 1)
      }
    }
  }

  const loadPhotos = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      const data = await PhotoService.getPhotos(filters)
      photos.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load photos'
    } finally {
      loading.value = false
    }
  }

  const cleanup = () => {
    if (photosChannel) {
      supabase.removeChannel(photosChannel)
    }
    if (likesChannel) {
      supabase.removeChannel(likesChannel)
    }
  }

  onMounted(() => {
    setupRealtimeSubscriptions()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    photos,
    loading,
    error,
    loadPhotos,
    cleanup
  }
}
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
        paddingBottom: `${(photo.image_metadata?.height / photo.image_metadata?.width) * 100}%` 
      }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
    
    <img
      ref="imageRef"
      :src="isIntersecting ? optimizedSrc : ''"
      :alt="photo.title"
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
        <div v-if="photo.camera_settings" class="text-xs mt-2 opacity-75">
          {{ photo.camera_settings.camera }} • {{ photo.camera_settings.lens }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getImageUrl } from '@/lib/supabase'
import type { Photo } from '@/types/database'

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

const optimizedSrc = computed(() => {
  if (props.photo.thumbnail_url && props.size === 'small') {
    return getImageUrl(props.photo.thumbnail_url)
  }
  return getImageUrl(props.photo.image_url)
})

const displayWidth = computed(() => {
  return props.photo.image_metadata?.width || 800
})

const displayHeight = computed(() => {
  return props.photo.image_metadata?.height || 600
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
          'supabase': ['@supabase/supabase-js'],
          'ui-components': ['@headlessui/vue', '@heroicons/vue'],
          'utils': ['@vueuse/core']
        }
      }
    },
    
    cssCodeSplit: true,
    cssMinify: 'lightningcss'
  },
  
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'pinia', '@supabase/supabase-js'],
    exclude: ['@tailwindcss/vite']
  }
})
```

## Production Package.json

```json
{
  "name": "vue3-photography-portfolio-supabase",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "analyze": "vite build --mode analyze",
    "lint": "eslint . --ext .vue,.js,.ts --fix",
    "type-check": "vue-tsc --noEmit",
    "supabase:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/database.ts"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    "@vueuse/core": "^10.5.0",
    "@vueuse/head": "^2.0.0",
    "@supabase/supabase-js": "^2.39.0"
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
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.10.0"
}
```

## Real-Time Photo Gallery Component

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
          :key="photo.id"
          class="photo-card group relative cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
          @click="openLightbox(photo)"
        >
          <img
            :src="getImageUrl(photo.thumbnail_url || photo.image_url)"
            :alt="photo.title"
            class="w-full h-64 object-cover"
            loading="lazy"
          />
          
          <!-- Real-time Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
            <!-- Like Button -->
            <button
              @click.stop="toggleLike(photo.id)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
              :class="{ 'text-red-500': isLiked(photo.id), 'text-gray-600': !isLiked(photo.id) }"
            >
              <HeartIcon class="w-5 h-5" :filled="isLiked(photo.id)" />
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
                    <span>{{ photo.like_count }}</span>
                  </div>
                  <div class="flex items-center space-x-1 mt-1">
                    <EyeIcon class="w-3 h-3" />
                    <span>{{ photo.view_count }}</span>
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
import { useRealtimePhotos } from '@/composables/useRealtimePhotos'
import { PhotoService } from '@/services/photoService'
import { getImageUrl } from '@/lib/supabase'
import type { Photo } from '@/types/database'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const { photos, loading, loadPhotos } = useRealtimePhotos()
const userLikes = ref<Set<string>>(new Set())
const notifications = ref<Notification[]>([])

// Connection status (simplified for Supabase)
const connectionStatus = computed(() => 'Live')
const connectionStatusClass = computed(() => ({
  'bg-green-500 text-white': true
}))
const connectionDotClass = computed(() => ({
  'bg-white': true
}))

// Photo interactions
const toggleLike = async (photoId: string) => {
  try {
    const result = await PhotoService.toggleLike(photoId)
    if (result.liked) {
      userLikes.value.add(photoId)
    } else {
      userLikes.value.delete(photoId)
    }
  } catch (error) {
    addNotification('Failed to update like', 'error')
  }
}

const isLiked = (photoId: string) => {
  return userLikes.value.has(photoId)
}

const openLightbox = async (photo: Photo) => {
  // Track view
  try {
    await PhotoService.incrementViews(photo.id)
  } catch (error) {
    console.error('Failed to track view:', error)
  }
  
  // Open lightbox logic here
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
pnpm install -D vitest @vue/test-utils jsdom @vitest/ui
pnpm install -D @testing-library/vue @testing-library/jest-dom
pnpm install -D @testing-library/user-event happy-dom
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

### Testing Supabase Integration

#### Mock Supabase Client

```typescript
// tests/__mocks__/supabase.ts
import { vi } from 'vitest'

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    then: vi.fn()
  })),
  rpc: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'http://test.com/image.jpg' } })),
      upload: vi.fn()
    }))
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn()
  })),
  removeChannel: vi.fn()
}

export { mockSupabase as supabase }
```

#### Testing Photo Service

```typescript
// tests/services/photoService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PhotoService } from '@/services/photoService'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Photo',
            image_url: '/test.jpg',
            category: 'landscape',
            featured: true
          }
        ],
        error: null
      })
    })),
    rpc: vi.fn()
  }
}))

describe('PhotoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPhotos', () => {
    it('should fetch photos with filters', async () => {
      const photos = await PhotoService.getPhotos({
        category: 'landscape',
        featured: true,
        limit: 10
      })

      expect(photos).toHaveLength(1)
      expect(photos[0].title).toBe('Test Photo')
    })

    it('should handle API errors', async () => {
      // Mock error response
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      })

      await expect(PhotoService.getPhotos()).rejects.toThrow('Database error')
    })
  })

  describe('toggleLike', () => {
    it('should toggle photo like', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: { liked: true, like_count: 5 },
        error: null
      })

      const result = await PhotoService.toggleLike('photo-id')
      
      expect(result.liked).toBe(true)
      expect(result.like_count).toBe(5)
      expect(supabase.rpc).toHaveBeenCalledWith('toggle_photo_like', {
        photo_uuid: 'photo-id',
        client_ip: '192.168.1.1'
      })
    })
  })
})
```

## Image Storage & Processing with Supabase

### Storage Bucket Setup

```sql
-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Create policy for photo uploads
CREATE POLICY "Anyone can view photos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'photos' 
    AND auth.role() = 'authenticated'
  );
```

### Image Processing Edge Function

```typescript
// supabase/functions/process-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl, photoId } = await req.json()
    
    // Process image (resize, generate thumbnails, extract metadata)
    const processedImage = await processImage(imageUrl)
    
    // Update photo record with processed data
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase
      .from('photos')
      .update({
        image_metadata: processedImage.metadata,
        thumbnail_url: processedImage.thumbnailUrl
      })
      .eq('id', photoId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data: processedImage }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function processImage(imageUrl: string) {
  // Implementation for image processing
  // Could use Deno's WebAssembly or external service
  return {
    metadata: {
      width: 1920,
      height: 1080,
      format: 'jpeg',
      size: 245760
    },
    thumbnailUrl: imageUrl.replace('.jpg', '_thumb.jpg')
  }
}
```

## Deployment Configuration

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # For admin operations
```

### Self-Hosted Supabase

```yaml
# docker-compose.yml for self-hosted Supabase
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: supabase
      POSTGRES_USER: supabase
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  supabase:
    image: supabase/supabase:latest
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: supabase
      POSTGRES_USER: supabase
      POSTGRES_PASSWORD: your-password
      JWT_SECRET: your-jwt-secret
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "5173:5173"
    environment:
      - VITE_SUPABASE_URL=http://localhost:3000
    command: pnpm run dev

volumes:
  postgres_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Photography Portfolio

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
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm run test:run
      
      - name: TypeScript check
        run: pnpm run type-check
      
      - name: Build frontend
        run: pnpm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: dist/

  deploy:
    needs: test-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Deploy Supabase Functions
        run: |
          npx supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Performance Monitoring

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

This comprehensive implementation guide provides everything needed to build a modern, high-performance photography portfolio using the latest versions of Vue 3, Tailwind CSS v4, and Supabase. The setup emphasizes developer experience, performance optimization, and production readiness with modern deployment strategies and monitoring capabilities.

## Quick Start Summary

1. **Setup Vue 3 + Tailwind CSS v4**: Modern frontend with zero-config CSS
2. **Configure Supabase**: Open source PostgreSQL backend with real-time
3. **Implement TDD**: Comprehensive testing with Vitest
4. **Add Real-time Features**: Live photo interactions and updates
5. **Deploy**: Self-hosted or cloud deployment options

The combination of Vue 3's reactivity, Tailwind CSS v4's performance, and Supabase's open source backend creates a powerful, scalable photography portfolio platform that's both developer-friendly and production-ready.