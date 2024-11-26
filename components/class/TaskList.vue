<template>
  <div v-if="tasks.length > 0" class="mt-8">
    <h3 class="text-lg font-semibold mb-4">Tareas creadas:</h3>
    <div class="space-y-4">
      <div v-for="(task, index) in tasks" 
        :key="index" 
        class="border p-4 rounded-lg shadow-sm"
      >
        <TaskItem 
          :task="task" 
          @delete="$emit('delete-task', index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tasks: any[]
}>();
</script> 