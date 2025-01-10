<template>
  <!-- Contenedor de cargando que ocupa toda la página -->

  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
  >
    <p class="text-title-color text-2xl">Cargando...</p>
  </div>

  <!-- El contenido del curso una vez cargado -->
  <div v-if="courses" class="w-4/5">
    <ContentLayout>
      <OrganismCourseCard :coursesData="currentCourse" />
    </ContentLayout>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/admin/course-19/classes">Classes</NuxtLink>
        </li>
      </ul>
    </nav>
    <main>
      <Classes />
    </main>
  </div>
  <div v-else>
    <p>No courses found</p>
    <ClientOnly>
      {{ redirectToCourses() }}
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import OrganismCourseCard from "~/components/organisim/CourseCard.vue";
import Classes from "~/pages/admin/course-[courseId]/classes.vue";
import ContentLayout from "~/layouts/contentLayout.vue";
import type { CourseForm } from "~/interfaces/modal.interface";
import { routes } from "~/data/routes";

const route = useRoute();

const routeCourseId = route.params.courseId as string;

console.log("routeCourseId", routeCourseId);
// Use the shared query composable
const { data: courses, isLoading, error } = useCoursesQuery();
console.log(courses.value);
// Get the specific course using computed

// Get only the current course based on courseId
const currentCourse = computed(() => {
  if (!courses.value) return null;
  return courses.value.filter(
    (course: CourseForm) => course.id === Number(routeCourseId)
  );
});

// Add this function to handle the redirect
const redirectToCourses = () => {
  setTimeout(() => {
    navigateTo(routes.routesAdmin.courses);
  }, 2000); // Redirect after 2 seconds
};


</script>
