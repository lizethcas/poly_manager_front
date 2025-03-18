<template>
    <div class="max-w-md mx-auto p-4">
      <div class="bg-sky-50 rounded-lg p-4 mb-4 flex items-start">
        <div class="relative mr-3">
          <div class="bg-cyan-500 rounded-full w-12 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 bg-cyan-500 rounded-full w-5 h-5 flex items-center justify-center">
            <span class="text-white text-xs font-bold">🇬🇧</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="h-4 bg-sky-100 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-sky-100 rounded w-1/2"></div>
        </div>
      </div>
  
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold mb-3">Puedes gestionar tus cursos aquí</h2>
        <p class="text-gray-700 mb-6">
          El servicio estará disponible cuando comiences a estudiar una nueva materia o añadas una persona a tu familia.
        </p>
        <button class="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors">
          VER CURSOS
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  // No additional script logic needed for this component
  </script>
  
  <style scoped>
  /* Additional styles can be added here if needed */
  </style>