<template>
  <NuxtLayout>
    <TaskSelector :taskTitle="taskTitle" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import TaskSelector from "~/components/organisim/TaskSelector.vue";
import { useTaskStore } from "~/stores/task.store";

// Add the selectedTask prop definition
interface Props {
  selectedTask?: {
    name: string;
    type: string;
  };
}

const props = defineProps<Props>();
const taskTitle = ref<string>("Multiple choice");
defineEmits(["close", "submit", "update:modelValue"]);

const taskStore = useTaskStore();

// Watch for changes in selectedTask prop
watch(
  () => props.selectedTask,
  (newTask) => {
    if (newTask?.name) {
      taskTitle.value = newTask.name;
      console.log("New task title:", taskTitle.value);
    }
  },
  { immediate: true }
);
</script>
