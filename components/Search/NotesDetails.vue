<template>
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="text-sm text-gray-500 mb-1">{{ formattedDate }}</div>
      <h3 class="text-lg font-semibold mb-3 text-blue-500">{{ item.title }}</h3>
      <div class="space-y-2 mb-4">
        <p class="text-gray-700">{{ item.content }}</p>
        <ol class="list-decimal ml-5 space-y-1">
          <li v-for="(tag, index) in item.tags" :key="index">{{ tag }}</li>
        </ol>
      </div>
      <button class="bg-blue-500 text-white px-5 py-1 rounded-lg hover:bg-blue-600 transition-colors w-full md:w-fit">
        Open
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  });
  
  const formattedDate = computed(() => {
    const date = new Date(props.item.created_at);
    return date.toLocaleDateString();
  });
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales aquí si es necesario */
  </style>