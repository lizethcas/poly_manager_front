<template>
  <div v-if="classTasks">
    <div v-for="(task, index) in classTasks.data">
      <div
        class="bg-white p-4 rounded-md shadow-md"
        v-if="
          task.tittle !== '' &&
          task.content_type !== 'video' &&
          task.content_type !== 'info_box'
        "
      >
        <div class="flex justify-start gap-2 my-2">
          <p class="bg-tarawera-100 text-primary-color px-2 py-1 rounded-md">
            {{ getTaskNumber(index) }}
          </p>
          <h3 class="text-lg font-semibold">
            {{ capitalizeFirstLetter(task.tittle) }}
          </h3>
        </div>
        <p class="text-sm font-semibold">{{ task.instructions }}</p>
        <slot :task="task" :index="index" />
      </div>
    </div>
  </div>
  <div v-else>
    <pre>Aun no hay contenido para esta clase</pre>
  </div>
</template>
<script setup lang="ts">
import { useCapitalizerLetter } from "~/composables/useCapitalizerLetter";
import { useClassContents } from "~/composables/useClassContents";
import { useRoute } from "vue-router";

const route = useRoute();
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(route.params.classId as string);
console.log(classTasks);
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
</script>
