<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <p>Loading tasks...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-red-500 flex justify-center items-center mt-4"
    >
      <p>Error loading tasks: {{ error.message }}</p>
    </div>

    <div v-if="!classContents?.data || classContents?.data.length === 0">
      <pre>Aun no hay contenido para esta clase</pre>
    </div>
    <!-- Content -->
    <div v-else-if="classContents?.data" class="mt-4">
      <pre>{{ classContents.data }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useClassContents } from "~/composables/useClassContents";

const route = useRoute();
const classId = route.params.classId;
const { classContents, isLoading, error } = useClassContents(classId);
</script>
