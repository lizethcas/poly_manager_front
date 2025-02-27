<template>
 
  <div v-if="!isLoading && currentCourse.length > 0" class="flex items-center">
    <img

      src="~/assets/images/back-button-round.webp"

      alt="regresar una pagina"
      class="w-10 h-10 cursor-pointer items-center mr-2"
      @click="handleBackNavigation"
    />
    <CourseCardStudent :courses="currentCourse" />
  </div>
  <div v-else>
    <h1>No hay clases disponibles</h1>
  </div>
  <ClassCardStudent />


</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import { useClassesQuery } from "~/composables/useClassesQuery";
import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import type { Course } from "~/interfaces/course.interface";

const route = useRoute();
const courseId = route.params.courseid;

const { data: classes, isLoading, error } = useClassesQuery(courseId as string);
console.log(classes);
// Get only the current course based on courseId
const currentCourse = computed(() => {
  if (!classes.value) return [];
  return classes.value.filter(
    (course: Course) => course.id === Number(courseId)
  );
});

console.log(currentCourse.value);

const handleBackNavigation = () => {
  navigateTo("/student/courses");
};
</script>
