<template>
  <div>
    <ClassCardStudent :class="classes" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});

import { useClassesByStudentIdQuery } from "~/composables/useClassesQuery";

import ClassCardStudent from "~/components/organisim/templatesUsers/students/ClassCardStudent.vue";

const route = useRoute();
const studentId = route.params.studentId as string;
console.log(studentId);
const { data: classes, isLoading, error } = useClassesByStudentIdQuery(studentId);

console.log(classes.value);
</script>