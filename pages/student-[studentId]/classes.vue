<template>
  <Loading v-if="isLoading" />
  <Error v-if="error" />
  <div v-else>
    <!-- Si hay clases, mostrar ClassCardStudent -->
    <ClassCardStudent 
      v-if="classes && classes.length > 0" 
      :classes="classes" 
    />
    
    <!-- Si no hay clases, mostrar CourseManagement -->
    <div v-else>
      <div class="text-center mb-6">
        <p class="text-gray-600 text-lg">Aún no tienes clases registradas</p>
        <p class="text-gray-500 text-sm mt-1">Puedes inscribirte a un curso para comenzar tu aprendizaje</p>
      </div>
      <CourseManagement />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});

import { useClassesByStudentIdQuery } from "~/composables/useClassesQuery";
import Error from "~/components/organisim/alerts/Error.vue";
import Loading from "~/components/organisim/alerts/Loading.vue";
import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";
import CourseManagement from "~/components/CourseManagement.vue";

const route = useRoute();
const studentId = route.params.studentId as string;
const {
  data: classes,
  isLoading,
  error,
} = useClassesByStudentIdQuery(studentId);
</script>