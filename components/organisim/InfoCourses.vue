<template>
    <div class="bg-purple-200 mt-10 rounded-3xl p-6 relative overflow-hidden">
    
     
      
      <!-- Contenido principal -->
      <div class="flex flex-col md:flex-row items-center relative z-10">
        <!-- Texto -->
        <div class="w-full md:w-3/5 mb-6 md:mb-0">
          <h2 class="text-purple-700 text-2xl font-bold mb-3">{{ title }}</h2>
          <p class="text-purple-700 text-sm mb-6">
            {{ description }}
          </p>
          <div 
            class="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-purple-100 transition-colors"
            @click="navigateTo(`/student-${studentId}/courses`)"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              class="text-purple-700"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>
        
        <!-- Imagen destacada -->
        <div class="w-full md:w-2/5 relative">
          <img 
            :src="image" 
            :alt="title" 
            class="object-contain h-60 md:h-72 mx-auto"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from "~/stores/auth";
  
  const authStore = useAuthStore();
  const studentId = authStore.getUserId();
  
  defineProps<{
    title: string
    description: string
    image: string
  }>();
  </script>