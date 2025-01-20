<template>
  <div>
    <h1>Student</h1>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});
import { useRoute } from '#imports';
const route = useRoute();
const courseId = route.params.courseId;
const classId = route.params.classId;

</script>
