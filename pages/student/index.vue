<template>
  <div>
    <h1>Student</h1>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: "auth"
});
import { useRoute, navigateTo, useNuxtApp, useRouter } from '#imports';

const route = useRoute();
const router = useRouter();
const { $auth } = useNuxtApp();
const courseId = route.params.courseId;
const classId = route.params.classId;

// Updated auth check to match admin page
onMounted(() => {
  if (!$auth?.currentUser) {
    router.push('/login');
  }
});
</script>
