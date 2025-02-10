<template>
  
  <div v-if="isLoading">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="error">
    <h1>Error</h1>
  </div>
  <div v-else>
    <CourseCardStudent :courses="courses" v-show="courses.length > 0" />
  </div>


</template>
<script setup lang="ts">

definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useCoursesQuery } from "~/composables/useCourseQuery";

const { data: courses, isLoading, error } = useCoursesQuery();


</script>
