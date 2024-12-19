<template>
  <uploadImage />

  <MoleculeInput
    type="text_area"
    title="Add script"
    size="lg"
    container-class="py-2"
  />

  <NuxtLayout>
    <TaskSelector :taskTitle="taskTitle" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import uploadImage from "~/components/organisim/UploadImage.vue";
import MoleculeInput from "~/components/molecule/Input.vue";
import TaskSelector from "~/components/organisim/TaskSelector.vue";
import { useTaskStore } from "~/stores/task.store";


interface Props {
  selectedTask?: {
    name: string;
    type: string;
  };
}

const taskStore = useTaskStore();
const props = defineProps<Props>();
const taskTitle = ref<string>("Layout");
defineEmits(["close", "submit", "update:modelValue"]);

watch(
  () => props.selectedTask,
  (newTask) => {
    if (newTask?.name) {
      taskTitle.value = newTask.name;
      taskStore.addTask('taskTitle', newTask.type);
      console.log(taskStore.getTask(taskTitle.value));
    }
  },
  { immediate: true }
);
</script>
