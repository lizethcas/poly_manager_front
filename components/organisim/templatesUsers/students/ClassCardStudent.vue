<template>
  <div class="mt-4 flex flex-col pl-20">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <div
      v-for="(classItem, index) in filteredClasses"
      :key="classItem.id"
      class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-4 flex w-full"
    >
      <div class="flex flex-col justify-between w-full">
        <div class="flex items-start gap-4 p-4">
          <!-- Left side with number -->
          <div h-8>
            <div
              class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium"
            >
              {{ index }}
            </div>
          </div>
          <!-- Middle content -->
          <div class="flex flex-col justify-between">
            <!-- Title section -->

            <div class="mb-2">
              <h2 class="text-lg font-medium">{{ classItem.class_name }}</h2>
              <p class="text-gray-600 text-sm">
                {{
                  getDisplayedDescription(classItem.description, classItem.id)
                }}
                <button
                  v-if="
                    classItem.description &&
                    classItem.description.length > MAX_DESCRIPTION_LENGTH
                  "
                  @click="toggleDescription(classItem.id)"
                  class="text-blue-500 hover:text-blue-700 ml-1"
                >
                  {{
                    truncatedDescriptions[classItem.id]
                      ? "Show less"
                      : "Show more"
                  }}
                </button>
              </p>
            </div>
          </div>

          <!-- Right side image -->
        </div>
        <!-- Bottom status and actions -->
        <div
          class="flex items-center justify-center gap-2 p-2 w-full bg-[#DFEAF9]"
        >
          <div
            class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span class="text-gray-600">completed</span>
          </div>
          <button @click="showClassDescription(classItem, index)">
            start class
          </button>
        </div>
      </div>
      <div class="w-72 h-full">
        <img
          :src="classItem.cover"
          :alt="classItem.class_name"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
  <ClassDescription
    v-if="isDescriptionVisible"
    :class-item="selectedClass"
    :is-open="isDescriptionVisible"
    @close="isDescriptionVisible = false"
  />
</template>

<script setup lang="ts">
import { useRoute } from "#imports";
import ClassDescription from "./ClassDescription.vue";
import { useClassesQuery } from "~/composables/useClassesQuery";
import { computed } from "vue";
import { useTaskStore } from "~/stores/task.store";

const route = useRoute();
const courseId = route.params.courseid;
const selectedClass = ref({});
const taskStore = useTaskStore();
const { data: classes, isPending, error } = useClassesQuery(courseId);

const filteredClasses = computed(() => {
  if (!classes.value) return [];
  return classes.value.filter((classItem) => {
    return (
      classItem &&
      classItem.course_id &&
      classItem.course_id.toString() === courseId &&
      classItem.publish === true
    );
  });
});

const isDescriptionVisible = ref(false);

const showClassDescription = (classItem: any, index: number) => {
  selectedClass.value = {
    ...classItem,
    unit: index,
    course_id: courseId,
  };
  isDescriptionVisible.value = true;
};

const MAX_DESCRIPTION_LENGTH = 100;

const truncatedDescriptions = ref<{ [key: string]: boolean }>({});

const getDisplayedDescription = (description: string, classId: string) => {
  if (!description) return "";
  if (
    description.length <= MAX_DESCRIPTION_LENGTH ||
    truncatedDescriptions.value[classId]
  ) {
    return description;
  }
  return description.slice(0, MAX_DESCRIPTION_LENGTH) + "...";
};

const toggleDescription = (classId: string) => {
  truncatedDescriptions.value[classId] = !truncatedDescriptions.value[classId];
};
</script>
