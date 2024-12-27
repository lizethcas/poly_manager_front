<template>
  <div class="p-4 p-8 flex flex-col items-end">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <div
      v-for="(classItem, index) in classes"
      :key="classItem.id"
      class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-4 flex  w-9/12"
    >
      <div class="flex flex-col justify-between w-full">
        <div class="flex items-start gap-4 p-4">
          <!-- Left side with number -->
          <div
            class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium"
          >
            {{ index }}
          </div>

          <!-- Middle content -->
          <div class="flex flex-col justify-between">
            <!-- Title section -->
            <div class="mb-2">
              <h2 class="text-lg font-medium">{{ classItem.class_name }}</h2>
              <p class="text-gray-600">{{ classItem.description }}</p>
            </div>
          </div>

          <!-- Right side image -->
        </div>
        <!-- Bottom status and actions -->
        <div class="flex items-center justify-center gap-2 p-2 w-full bg-[#DFEAF9]">
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
          <NuxtLink
            class="text-blue-500 hover:underline"
            :to="`/course-students/${classItem.course_id}/class-students/${classItem.id}`"
          >
            Repeat this class
          </NuxtLink>
        </div>
      </div>
      <div class="w-72">
        <img
          :src="classItem.cover"
          :alt="classItem.class_name"
          class="w-full h-48 object-cover rounded-r-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const courseId = route.params.courseId as string;
import { useClassesQuery } from "~/composables/useClassesQuery";

const { data: classes, isPending, error } = useClassesQuery(courseId);

const router = useRouter();

const handlePreviewClick = (classId: number, courseId: number) => {
  navigateTo(`/course-students/${courseId}/class-students/${classId}`);
};
</script>
