<template>
  <div class="flex flex-col bg-green-400">
    <div class="w-full mb-4">
      <img 
        :src="item.image || '/placeholder.svg?height=150&width=150'" 
        alt="Thumbnail"
        class="rounded-lg w-32 h-32 object-cover mx-auto"
      />
    </div>
    <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
    <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
    <button 
      @click="openLesson"
      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
    >
      Open
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: Object
});

const openLesson = () => {
  console.log('Opening class:', props.item);
};
</script>