<template>
  <!-- Contenedor de cargando que ocupa toda la página -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
  >
    <p class="text-title-color text-2xl">Cargando...</p>
  </div>

  <!-- El contenido del curso una vez cargado -->
  <div v-if="courses">
    <NuxtLayout name="content-layout">
      <OrganismCourseCard :coursesData="currentCourse" />
    </NuxtLayout>

    <main class="mb-4">
      <!-- Navigation tabs -->
      <NuxtLayout name="course-admin-layout">
        <!-- Render the route components here -->
        <NuxtPage />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});

import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import type { CourseForm } from "~/interfaces/modal.interface";
import OrganismCourseCard from "~/components/organisim/CourseCard.vue";

const route = useRoute();

const routeCourseId = route.params.courseId as string;

// Use the shared query composable
const { data: courses, isLoading, error } = useCoursesQuery();
// Get the specific course using computed

// Get only the current course based on courseId
const currentCourse = computed(() => {
  if (!courses.value) return null;
  return courses.value.filter(
    (course: CourseForm) => course.id === Number(routeCourseId)
  );
});
</script>
