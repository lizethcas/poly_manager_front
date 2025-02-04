<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error loading courses</div>
  <template v-else>
    <CourseCardStudent :courses="courses || []" v-if="courses && courses.length > 0" />
    <InfoCourses
      v-else
      v-for="course in infoCourses"
      :key="course.title"
      :title="course.title"
      :description="course.description"
      :image="course.image"
    />
  </template>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import InfoCourses from "~/components/organisim/InfoCourses.vue";
import { infoCourses } from "~/data/infoCourses";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useCoursesQuery } from "~/composables/useCourseQuery";
import { useRoute } from "vue-router";

const route = useRoute();
const studentId = route.params.id;


const {
  data: courses,
  isLoading,
  error,
} = useCoursesQuery(studentId as string);

</script>
