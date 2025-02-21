<template>
  <div class="w-full m-auto">
   

    <div 
      :class="[
        'grid gap-4',
        parsedImages.length === 1 ? 'grid-cols-1' : 
        parsedImages.length === 2 ? 'grid-cols-2' :
        'grid-cols-3'
      ]"
    >
      <div v-for="(image, index) in parsedImages" :key="index" class="w-full">
        <img 
          :src="getFullImageUrl(image.image_url)" 
          :alt="image.title"
          class="w-full h-80 rounded-lg object-cover object-center"
          @error="(e) => console.error('Error loading image:', image.image_url, e)"
          @load="() => console.log('Image loaded:', image.image_url)"
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
import { computed } from 'vue';

const props = defineProps({
  images: {
    type: [Array, String, Object],
    required: true,
    default: () => []
  }
});

// Parsear las imágenes si vienen como string
const parsedImages = computed(() => {
  try {
    if (typeof props.images === 'string') {
      return JSON.parse(props.images).images;
    } else if (props.images && typeof props.images === 'object' && 'images' in props.images) {
      return props.images.images;
    }
    return props.images;
  } catch (e) {
    console.error('Error parsing images:', e);
    return [];
  }
});

// Función para construir la URL completa de la imagen
const getFullImageUrl = (url: string) => {
  if (!url) return '';
  // Asegúrate de que esta sea la URL base correcta de tu servidor
  const baseUrl = 'http://localhost:8000';
  return url.startsWith('http') ? url : `${baseUrl}${url}`;
};

// Log para debugging
console.log('Props recibidos:', props.images);
console.log('Imágenes parseadas:', parsedImages.value);
</script> 