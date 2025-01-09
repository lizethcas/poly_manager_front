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
    <header class="text-title-color mb-4 flex items-center">
      <img
        src="~/assets/images/back-button-round.webp"
        alt="regresar una pagina"
        class="w-8 h-8 cursor-pointer items-center m-2 my-4"
        @click="handleBackNavigation"
      />
      <div class="w-4/5">
        <OrganismCourseCard :coursesData="currentCourse" />
      </div>
    </header>

    <main class="px-2 mb-4">
      <!-- Navigation tabs -->
      <NuxtLayout>
        <nav class="flex justify-start gap-4 border-b border-gray-300">
          <ul class="flex gap-8">
            <li>
              <NuxtLink
                :to="`/admin/course-${routeCourseId}/lessons`"
                class="relative pb-2 font-bold text-gray-60 hover:text-tarawera-700"
                :class="{
                  'text-primary-color underline-active':
                    $route.path === `/admin/course-${routeCourseId}/classes`,
                }"
              >
                Curriculum
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`/admin/course-${routeCourseId}/students`"
                class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
                :class="{
                  'text-tarawera-700 underline-active':
                    $route.path === `/admin/course-${routeCourseId}/students`,
                }"
              >
                Students
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="`/admin/course-${routeCourseId}/statistics`"
                class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
                :class="{
                  'text-tarawera-700 underline-active':
                    $route.path === `/admin/course-${routeCourseId}/statistics`,
                }"
              >
                Stats
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Render the route components here -->
        <NuxtPage />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import type { CourseForm } from "~/interfaces/modal.interface";
import OrganismCourseCard from "~/components/organisim/CourseCard.vue";

const route = useRoute();
const router = useRouter()
const routeCourseId = route.params.courseId as string;

console.log("routeCourseId", routeCourseId);
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

const handleBackNavigation = () => {
  if (route.path.includes("/admin/course/")) {
    console.log("route.path", route.path);
    navigateTo(`/admin/course/${routeCourseId}`);
  } else {
    navigateTo("/admin/courses/");
  }
};
</script>
