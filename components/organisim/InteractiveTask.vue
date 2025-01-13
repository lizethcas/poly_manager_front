<template>
  <div class="fixed ">
    <h3 class="text-md font-bold text-gray-700 mb-2">Modules</h3>
    <ul>
      <li
        v-for="task in menuItems"
        :key="task.type"
        @click="selectTask(task)"
        :class="[
          'flex items-center gap-2 hover:bg-gray-200 rounded cursor-pointer text-sm text-gray-700 mb-2',
          selectedTask?.type === task.type ? 'bg-gray-200' : '',
        ]"
      >
        {{ task.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Define the task options structure
interface TaskMenuItem {
  name: string;
  type: string;
  title: string;
}
// Add ref for selected task
import { ref } from "vue";
const selectedTask = ref<TaskMenuItem | null>(null);

// Define props and emits
const props = defineProps<{ menuItems: TaskMenuItem[] }>();
const emit = defineEmits<{
  (e: "select-task", task: TaskMenuItem): void;
}>();

// Handle task selection
const selectTask = (task: TaskMenuItem) => {
  selectedTask.value = task;
  emit("select-task", task);
};
</script>
