<template>
  <div  class="flex items-center">
    <img
      src="~/assets/images/back-button-round.webp"
      alt="regresar una pagina"
      class="w-10 h-10 cursor-pointer items-center mr-2"
      @click="handleBackNavigation"
    />
    <CourseCardStudent :courses="courses" />
  </div>
  <ClassCardStudent :classes="classes" />

</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});
import { useCoursesQuery } from "~/composables/useCourseQuery";
import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useClassesByCourseIdQuery } from "~/composables/useCourseQuery";
import { useRoute } from "vue-router";

const route = useRoute();
const courseId = route.params.courseid;
console.log(route.params);

const { data: courses, isLoading, error } = useCoursesQuery(courseId as string);
const { data: classes, isLoading: isLoadingClasses, error: errorClasses } = useClassesByCourseIdQuery(courseId as string);

console.log(classes);
console.log(courses);

const handleBackNavigation = () => {
  navigateTo(`/student-${route.params.studentId}/my-courses`);
};
</script>
