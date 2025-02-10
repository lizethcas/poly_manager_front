<template>
  <uploadImage />

  <MoleculeInput
    type="text_area"
    title="Add script"
    size="lg"
    container-class="py-2"
    :model-value="script"
    @update:model-value="updateScript"
  />


  <NuxtLayout name="none">
    <TaskSelector :selected-task="selectedTask" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import UploadImage from "~/components/organisim/UploadImage.vue";
import MoleculeInput from "~/components/molecule/Input.vue";
import TaskSelector from "~/components/organisim/TaskSelector.vue";
import { useTaskStore } from "~/stores/task.store";
// Add prop definition
defineProps<{
  selectedTask?: string
}>();


const script = ref("");

const updateScript = (value: string) => {
  script.value = value;
  taskStore.addTask("script", script.value);
};

const taskStore = useTaskStore();
</script>
