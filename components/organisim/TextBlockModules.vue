<template>
  <div>
    <template v-if="taskTitle == 'plain_text'">
      <h3 class="text-s font-bold text-tarawera-700 mt-4">Text:</h3>
      <MoleculeInput
        type="text_area"
        size="lg"
        container-class="py-2"
        @update:modelValue="handleSubtitles"
      />
    </template>

    <template v-else-if="taskTitle == 'info_box'">
      <h1>{{ taskTitle }}d</h1>
    </template>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useRoute } from "vue-router";

const taskStore = useTaskStore();
const route = useRoute();
const taskTitle = computed(() => taskStore.getTask("taskTitle"));
const taskInstructions = computed(() => taskStore.getTask("instructions"));

const taskData = ref({
  ...createBaseTaskData(String(route.params.classId)    , taskTitle.value),
  text: "",
});

const handleSubtitles = (value: string) => {
  taskData.value.text = value;
};

watch(
  taskInstructions,
  (newValue) => {
    if (newValue) {
      taskData.value = {
        ...taskData.value,
        tittle: newValue.title || "",
        instructions: newValue.instructions || "",
      };
    }
  },
  { deep: true, immediate: true }
);

watch(taskData, (newTask) => {
  console.log('Task Data:', JSON.parse(JSON.stringify(newTask)));
}, { deep: true });
</script>
