<template>
  <NuxtLayout>
    <OrganisimVideoBlock />
    <!-- <TaskSelector :taskTitle="taskTitle" /> -->
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useTaskStore } from "~/stores/task.store";
const taskStore = useTaskStore();

// Establecer tarea predeterminada para MultimediaBlock


/* const taskTitle = computed(() => taskStore.getTask("taskTitle"));

watch(taskTitle, (newTask) => {
  console.log("Task title updated:", newTask);
}); */
</script>
