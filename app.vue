<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useCourseStore } from '@/stores/courseStore';

const courseStore = useCourseStore();


console.log(courseStore.courses);

</script>

<style scoped>
body {
  font-size: 14px;
}
</style>