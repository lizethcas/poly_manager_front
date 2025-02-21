<template>
  <div class="search-container">
    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <UInput
        v-model="searchQuery"
        placeholder="Buscar cursos, clases, contenidos..."
        :loading="isLoading"
        @input="handleSearch"
      >
        <template #trailing>
          <UIcon 
            name="i-heroicons-magnifying-glass-20-solid"
            class="text-gray-500"
          />
        </template>
      </UInput>
    </div>

    <!-- Resultados de búsqueda -->
    <div v-if="hasResults" class="search-results mt-4">
      <!-- Cursos -->
      <div v-if="results.cursos?.length" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Cursos</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="curso in results.cursos" :key="curso.id" class="p-4 border rounded-lg">
            <h4 class="font-medium">{{ curso.name }}</h4>
            <p class="text-sm text-gray-600">{{ curso.description }}</p>
          </div>
        </div>
      </div>

      <!-- Clases -->
      <div v-if="results.clases?.length" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Clases</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="clase in results.clases" :key="clase.id" class="p-4 border rounded-lg">
            <h4 class="font-medium">{{ clase.name }}</h4>
            <p class="text-sm text-gray-600">{{ clase.description }}</p>
          </div>
        </div>
      </div>

      <!-- Contenidos -->
      <div v-if="results.contenidos?.length" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Contenidos</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="contenido in results.contenidos" :key="contenido.id" class="p-4 border rounded-lg">
            <h4 class="font-medium">{{ contenido.tittle }}</h4>
            <p class="text-sm text-gray-600">{{ contenido.instructions }}</p>
          </div>
        </div>
      </div>

      <!-- Escenarios -->
      <div v-if="results.escenarios?.length" class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Escenarios</h3>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="escenario in results.escenarios" :key="escenario.id" class="p-4 border rounded-lg">
            <h4 class="font-medium">{{ escenario.name }}</h4>
            <p class="text-sm text-gray-600">{{ escenario.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <div v-if="noResults" class="text-center py-8 text-gray-500">
      No se encontraron resultados para tu búsqueda
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { searchService } from '~/services/search.service'
import debounce from 'lodash/debounce'

const searchQuery = ref('')
const results = ref<any>({})
const isLoading = ref(false)

const hasResults = computed(() => {
  return (
    results.value?.cursos?.length > 0 ||
    results.value?.clases?.length > 0 ||
    results.value?.contenidos?.length > 0 ||
    results.value?.escenarios?.length > 0
  )
})

const noResults = computed(() => {
  return searchQuery.value && !isLoading.value && !hasResults.value
})

// Función de búsqueda con debounce
const performSearch = debounce(async (query: string) => {
  if (!query.trim()) {
    results.value = {}
    return
  }

  try {
    isLoading.value = true
    const response = await searchService.search(query)
    results.value = response.data
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error)
    // Aquí podrías mostrar una notificación de error
  } finally {
    isLoading.value = false
  }
}, 300)

const handleSearch = () => {
  performSearch(searchQuery.value)
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
}
</style> 