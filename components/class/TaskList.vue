<template>
  <div v-if="tasks.length > 0" class="mt-8">
    <h3 class="text-lg font-semibold mb-4">Tareas creadas:</h3>
    <div class="space-y-4">
      <div v-for="task in tasks" :key="task.id" class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <h4 class="font-medium">{{ task.type }}</h4>
          <button @click="$emit('delete-task', task)" class="text-red-600">
            Eliminar
          </button>
        </div>
        <p class="text-gray-600 mt-2">{{ task.instructions }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tasks: Array<any>
}>();

defineEmits(['delete-task']);
</script> 