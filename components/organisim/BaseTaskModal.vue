<template>
  <div
    v-if="isOpen"
    class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-center"
  >
    <div
      class="bg-white pr-6 rounded-lg shadow-lg w-[95vw] h-[95vh] overflow-y-auto flex gap-4"
    >
      <!-- Lateral Menu -->

      <!-- Main Content -->
      <div class="flex-1 mt-6">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4 border-b-[1px] sticky top-0 bg-white z-10">
          <div class="flex items-center gap-2 m-2">
            <Icon :name="icon" size="30" class="text-primary-color " />
            <h2 class="text-m font-bold text-primary-color">{{ title }}</h2>
          </div>
          <img
            src="../../assets/images/close.webp"
            alt="close create course"
            class="w-5 h-5 cursor-pointer"
            @click="$emit('close')"
          />
        </div>
        <div class="flex gap-4">
          <div class="w-48 bg-gray-100 p-4 rounded-lg h-fit sticky top-1">
            <InteractiveTask
              :menuItems="menuItems"
              @select-task="handleTaskSelection"
            />
          </div>
          <div class="flex-1">
            <!-- Common Fields -->
            <div class="space-y-4 mb-6">
              <MoleculeInput
                :title="'Title'"
                type="text"
                class="text-md"
                v-model="formData.title"
              />
              <MoleculeInput
                :title="'Instructions'"
                type="text_area"
                size="lg"
                class="text-md"
                v-model="formData.instructions"
              />
            </div>
            <slot></slot>
          </div>

          <!-- Slot for specific content -->
        </div>

        <!-- Submit Button -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "~/stores/task.store";

import InteractiveTask from "./InteractiveTask.vue";

defineProps({
  isOpen: Boolean,
  title: String,
  modelValue: Object,
  icon: String,
  type: String,
  menuItems: Array,
});

interface TaskMenuItem {
  name: string | undefined;
  type: string | undefined;
}

const taskStore = useTaskStore();
const formData = ref({
  title: "",
  instructions: "",
});

// Observa los cambios en formData y registra en consola
watch(
  formData,
  (newValue) => {
    emit("update:modelValue", newValue);
    taskStore.addTask("instructions", newValue);
  },
  { deep: true }
);

const emit = defineEmits(["update:modelValue", "close"]);

// Add handler for task selection
const handleTaskSelection = (task: TaskMenuItem) => {
  taskStore.addTask("taskTitle", task.name);
  
};
</script>
