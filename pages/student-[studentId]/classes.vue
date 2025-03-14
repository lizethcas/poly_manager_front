<template>
  <Loading v-if="isLoading" />
  <Error v-if="error" />
  <div v-else>
    <ClassCardStudent :classes="classes" />
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

const route = useRoute();
const studentId = route.params.studentId as string;
console.log(studentId);
const {
  data: classes,
  isLoading,
  error,
} = useClassesByStudentIdQuery(studentId);

console.log(classes);
</script>
