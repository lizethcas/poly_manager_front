<template>
 <h3 class="text-md font-bold text-gray-700 mb-2">Modules</h3>
  <ul >
    <li
      v-for="task in menuItems"
      :key="task.type"
      @click="$emit('select-task', task)"
      class="flex items-center gap-2 hover:bg-gray-200 rounded cursor-pointer text-sm  text-gray-700 mb-2"
    >
      {{ task.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
// Define the task options structure
interface TaskMenuItem {
  name: string;
  type: string;
  title: string;
}
// Define props to receive task options from parent
defineProps<{ menuItems: TaskMenuItem[] }>();

</script>
