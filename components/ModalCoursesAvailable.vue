<template>
    <div>
      <!-- Botón para abrir el modal -->
      <button 
        @click="openModal" 
        class="bg-blue-500 mt-5 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md w-full flex items-center justify-center transition-colors duration-200"
      >
        <span class="mr-1">+</span> Add Product
      </button>
  
      <!-- Modal -->
      <Teleport to="body">
        <div 
          v-if="isModalOpen" 
          class="fixed inset-0 modal-background bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          @click="closeModal"
        >
          <div 
            class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Encabezado del modal -->
            <div class="p-6 border-b flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-800">Cursos de Inglés Disponibles</h2>
              <button 
                @click="closeModal" 
                class="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <!-- Contenido del modal -->
            <div class="p-6">
              <!-- Grid de cursos -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  v-for="course in courses" 
                  :key="course.id" 
                  class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div class="relative h-48 overflow-hidden">
                    <img 
                      :src="course.cover_url" 
                      :alt="course.name"
                      class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      @error="handleImageError"
                    />
                    <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                      {{ course.level }}
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="text-xs text-blue-600 font-semibold mb-1">{{ course.category }}</div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{{ course.name }}</h3>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-500">
                        {{ course.free_access ? 'Acceso gratuito' : 'Acceso premium' }}
                      </span>
                      <button 
                      @click="enrollInCourse(course.id)"
                      class="bg-green-100 hover:bg-green-200 text-green-800 font-medium text-sm py-1.5 px-3 rounded transition-colors duration-200"
                    >
                      Enrollarme
                    </button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Mensaje si no hay cursos -->
              <div v-if="courses.length === 0" class="text-center py-8">
                <p class="text-gray-500">No hay cursos disponibles en este momento.</p>
              </div>
            </div>
  
            <!-- Pie del modal -->
            <div class="p-6 border-t flex justify-end">
              <button 
                @click="closeModal" 
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Props para recibir los cursos
  const props = defineProps({
    courses: {
      type: Array,
      default: () => []
    }
  })
  
  // Método para inscribirse en un curso
    const enrollInCourse = (courseId) => {
        console.log('Enrolling in course:', courseId)
    }
  // Estado del modal
  const isModalOpen = ref(false)
  
  // Métodos para abrir y cerrar el modal
  const openModal = () => {
    isModalOpen.value = true
    document.body.style.overflow = 'hidden' // Prevenir scroll en el body
  }
  
  const closeModal = () => {
    isModalOpen.value = false
    document.body.style.overflow = '' // Restaurar scroll
  }
  
  // Manejar errores de carga de imágenes
  const handleImageError = (event) => {
    event.target.src = '/placeholder.jpg' // Imagen de respaldo
  }
  </script>
  
  <style scoped>

  .modal-background{
    background-color: rgba(0, 0, 0, 0.5);
  }
  /* Animación para el modal */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  /* Limitar texto a 2 líneas */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>