<template>
    <div class="relative w-full h-full rounded-xl overflow-hidden aspect-[4/3]">
      <!-- Imagen de fondo -->
      <img 
        :src="item.cover"
        alt="Scenario preview"
        class="w-full h-full object-cover"
      />
      
      <!-- Overlay gradiente -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>
      
      <!-- Contenido superpuesto -->
      <div class="absolute inset-0 p-4 flex flex-col justify-between">
        <!-- Header -->
        <div class="flex justify-between items-start">
          <div class="flex gap-2">
            <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
              NEW
            </span>
            <span class="bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              3D AGO
            </span>
          </div>
        </div>
        
        <!-- Footer content -->
        <div class=" p-3">
          <h3 class="text-white text-sm font-semibold mb-1">
            {{ item.name }}
          </h3>
          <p class="text-white text-sm mb-4">
            {{ item.description }}
          </p>
          <div class="flex items-center justify-between">
            <button class="bg-white text-black px-6 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Icon name="play" size="20" />
              start
            </button>
            <button class="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
              <Icon name="more-horizontal" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  });
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales aquí si es necesario */
  </style>