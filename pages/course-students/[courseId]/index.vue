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
  <ClassCardStudent />
</template>

<script lang="ts" setup>
import { useCoursesQuery } from "~/composables/useCourseQuery";
import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import type { Course } from "~/interfaces/course.interface";

const route = useRoute();
const courseId = route.params.courseId;

const { data: courses, isLoading, error } = useCoursesQuery();

// Get only the current course based on courseId
const currentCourse = computed(() => {
  if (!courses.value) return null;
  return courses.value.filter(
    (course: Course) => course.id === Number(courseId)
  );
});

const handleBackNavigation = () => {
  navigateTo("/courses/");
};
</script>
