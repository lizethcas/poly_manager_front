<template>
  <div>
    <template v-if="taskTitle == 'text_block'">
      <h3 class="text-s font-bold text-tarawera-700 mt-4">Text:</h3>
      <MoleculeInput
        type="text_area"
        size="xl"
        container-class="py-2"
        @update:modelValue="taskData.content_details[0].text = $event"
      />
    </template>

    <template v-else-if="taskTitle == 'info_box'">
      <h1>Info Box</h1>
    </template>

    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle v-model="taskData.stats" />
    </div>
    <MoleculeActionButtons
      @handleSave="handleSave()"
      @handleCancel="handleCancel"
      :isActive="isActive"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useRoute } from "vue-router";
import { useClassContentMutation } from '~/composables/useClassContentMutation';

const taskStore = useTaskStore();
const route = useRoute();
const mutation = useClassContentMutation();
const title = computed(() => taskStore.getTask("taskTitle"));
const taskTitle = ref("text_block");
const isActive = ref(false);

const taskInstructions = computed(() => taskStore.getTask("instructions"));


const taskData = ref({
  ...createBaseTaskData(String(route.params.classId), taskTitle.value),
  content_details: [{ text: '', columns: 1 }],
});

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

watch(title, (newTask) => {
  console.log(newTask);
  taskTitle.value = newTask == "Plain Text" ? "text_block" : "info_box";
});

watch(
  taskData,
  (newTask) => {
    console.log("Task Data:", JSON.parse(JSON.stringify(newTask)));
  },
  { deep: true }
);

watch(taskData.value.content_details, (newTask) => {
  if (newTask[0].text != "") {
    isActive.value = true;
  } else {
    isActive.value = false;
  }
});

const handleSave = async () => {
  try {
    const payload = {
      class_id: String(route.params.classId),
      content_type: taskTitle.value.toLowerCase().replace(' ', '_'),
      content_details: JSON.stringify(taskData.value.content_details),
      tittle: taskData.value.tittle,
      instructions: taskData.value.instructions,
      stats: taskData.value.stats
    };

    await mutation.mutateAsync(payload);
    handleCancel();
    
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
  taskData.value = {
    ...createBaseTaskData(String(route.params.classId), taskTitle.value),
    content_details: [{ text: '', columns: 1 }],
  };
};
</script>
