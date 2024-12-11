<template>
  <nav class="flex justify-between items-center mb-8">
    <div class="flex gap-4">
      <button 
        v-for="button in buttons" 
        :key="button.type"
        @click="$emit('handle-modal', button.type)"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {{ button.label }}
      </button>
    </div>

    <button 
      @click="$emit('save-class')"
      class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium shadow-sm"
    >
      Guardar Clase
    </button>
  </nav>
</template>

<script setup lang="ts">
const buttons = [
  { type: 'image', label: 'Image Layout' },
  { type: 'video', label: 'Video Layout' },
  { type: 'layoutTask', label: 'Layout Task' }
];
</script> 