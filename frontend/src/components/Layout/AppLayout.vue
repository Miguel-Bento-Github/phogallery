<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header role="banner" class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="text-2xl font-bold text-gray-900">
              Photography Portfolio
            </router-link>
          </div>

          <!-- Navigation -->
          <nav role="navigation" class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link
                to="/"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-gray-900 bg-gray-100"
              >
                Gallery
              </router-link>
              <router-link
                to="/about"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-gray-900 bg-gray-100"
              >
                About
              </router-link>
              <router-link
                to="/contact"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-gray-900 bg-gray-100"
              >
                Contact
              </router-link>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main role="main" class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer role="contentinfo" class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <p class="text-gray-300">
            © {{ currentYear }} Photography Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
