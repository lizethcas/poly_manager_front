<template>
  <ListScenarios />
  <div v-if="classTasks">
    <div v-for="(task, index) in classTasks.data">
      <div class="mt-4 relative">
        <!-- <p
          v-if="!editTask || editingIndex !== index"
          class="absolute top-2 right-4 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          @click="handleEditTask(task, index)"
        >
          editar
        </p>
        <p
          v-else
          class="absolute top-2 right-4 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          @click="handleSaveTask(task, index)"
        >
          aceptar
        </p> -->
        <div class="py-4 pr-4">
          <div
            v-if="
              task.tittle !== '' &&
              task.content_type !== 'video' &&
              task.content_type !== 'info_box' &&
              currentTaskIndex >= index
            "
          >
            <div class="flex justify-start gap-2 w-full">
              <p
                class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md"
              >
                {{ getTaskNumber(index) }}
              </p>
              <h3 class="text-lg font-semibold">
                {{ capitalizeFirstLetter(task.tittle) }}
              </h3>
            </div>
            <p class="text-md mt-2">
              {{ task.instructions }}
            </p>
          </div>
        </div>
        <div>
          <slot :task="task" :index="index" />
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <pre>Aun no hay contenido para esta clase</pre>
  </div>
</template>
<script setup lang="ts">
import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";
import ListScenarios from "~/components/organisim/templatesUsers/teachers/ListScenarios.vue";
import { useClassContents } from "~/composables/useClassContents";
import { useRoute } from "vue-router";

const route = useRoute();
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(route.params.classId as string);

const editTask = ref(false);
const editingIndex = ref(-1);

const { capitalizeFirstLetter } = useCapitalizerLetter();
const getTaskNumber = (currentIndex: number) => {
  if (!classTasks.value?.data) return "";

  let mainNumber = 1;
  let subNumber = 0;

  for (let i = 0; i <= currentIndex; i++) {
    if (
      classTasks.value.data[i]?.tittle !== "" &&
      classTasks.value.data[i]?.content_type !== "info_box"
    ) {
      subNumber++;
      if (i === currentIndex) {
        return `${mainNumber}.${subNumber}`;
      }
    }
  }

  if (!classTasks.value.data[currentIndex]?.tittle) {
    return "";
  }

  return `${mainNumber}.${subNumber}`;
};
const handleEditTask = (task: any, index: number) => {
  editTask.value = true;
  editingIndex.value = index;
};

const handleSaveTask = (task: any, index: number) => {
  editTask.value = false;
  editingIndex.value = -1;
  // Here you would typically add logic to save the changes to your backend
};

// Add currentTaskIndex to props
defineProps<{
  currentTaskIndex?: number;
}>();
</script>
