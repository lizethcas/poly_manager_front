<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message || 'Error loading courses' }}</div>
  <template v-else>

    <div v-if="!courses">No courses data available</div>
    <CourseCardStudent 
      :courses="courses.data" 
     
    />
    <InfoCourses
      v-if="!courses?.data?.length"
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
import { watchEffect } from "vue";

const route = useRoute();
const studentId = route.params.studentId;


const {
  data: courses,
  isLoading,
  error,
} = useCoursesQuery(studentId as string);
console.log(courses.value);

watchEffect(() => {
  console.log('Current studentId:', studentId);
  console.log('Courses loading state:', isLoading.value);
  console.log('Courses error:', error.value);
  console.log('Courses data structure:', courses.value);
});
</script>
