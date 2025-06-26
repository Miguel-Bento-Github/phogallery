<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-gray-900 to-gray-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">Capturing Life's Moments</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8">
          Professional photography portfolio showcasing the beauty of the world
        </p>
        <button
          @click="scrollToGallery"
          class="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          View Gallery
        </button>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Featured Work</h2>
        <Gallery />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Gallery from '@/components/Gallery/Gallery.vue'

const scrollToGallery = () => {
  const element = document.getElementById('gallery')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
