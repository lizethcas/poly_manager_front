<template>
    
  <div class="w-full m-auto">
    <div 
      :class="[
        'grid gap-4',
        images.length === 1 ? 'grid-cols-1' : 
        images.length === 2 ? 'grid-cols-2' :
        'grid-cols-3'
      ]"
    >
      <div v-for="(image, index) in images" :key="index" class="w-full">
        <img 
          :src="image.image" 
          :alt="image.title"
          class="w-full h-80 rounded-lg object-cover object-center"
        />
        <div class="mt-2">
          <h3 class="font-semibold text-lg">{{ image.title }}</h3>
          <p class="text-gray-600">{{ image.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script> 