<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message || 'Error loading courses' }}</div>
  <template v-else>

    <div v-if="!enrolledCourses">No courses data available</div>
    <CourseCardStudent 
      :courses="enrolledCourses.data" 
    />

    <ModalCoursesAvailable :courses="availableCourses" />
    <InfoCourses
      v-for="coursePromo in promotionalCourses"
      :key="coursePromo.title"
      :title="coursePromo.title"
      :description="coursePromo.description"
      :image="coursePromo.image"
    />
  </template>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});

import InfoCourses from "~/components/organisim/InfoCourses.vue";
import { infoCourses as promotionalCourses } from "~/data/infoCourses";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import { useRoute } from "vue-router";

const route = useRoute();
const studentId = route.params.studentId;

const availableCourses = ref([]);

const {
  data: enrolledCourses,
  isLoading,
  error,
} = useCoursesQuery(studentId as string);


onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/dashboard/api/students/${studentId}/available-courses`);
    const responseJson = await response.json();
    availableCourses.value = responseJson.data;
  } catch (error) {
    console.error('Error al cargar los cursos disponibles:', error);
  }
})
</script>