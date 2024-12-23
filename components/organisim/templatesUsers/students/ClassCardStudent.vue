<template>
   
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Course Details</h1>
    <!-- Show loading state -->
    <div v-if="isPending">Loading...</div>
    <!-- Show error state -->
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-for="classItem in classes" key="classItem.id">
      {{ classItem.class_name }}
      <button @click="navigateTo(`/course-students/${courseId}/class-students/${classItem.id}`)">
        View Class
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const courseId = route.params.courseId as string;
import { useClassesQuery } from "~/composables/useClassesQuery";

const { data: classes, isPending, error } = useClassesQuery(courseId);

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};

</script>
