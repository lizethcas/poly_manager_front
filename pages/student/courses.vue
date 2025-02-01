<template>
  <CourseCardStudent :courses="courses" />
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
