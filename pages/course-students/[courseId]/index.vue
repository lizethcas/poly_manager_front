<template>
  <div v-if="!isLoading" class="flex items-center">
    <img
      src="~/assets/images/back-button-round.webp"
      alt="regresar una pagina"
      class="w-10 h-10 cursor-pointer items-center mr-2"
      @click="handleBackNavigation"
    />
    <CourseCardStudent :courses="courses" />
  </div>
  <ClassCardStudent />
</template>

<script lang="ts" setup>
import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
const { data: courses, isLoading, error } = useCoursesQuery();

const handleBackNavigation = () => {
  navigateTo("/courses/");
};


</script>
