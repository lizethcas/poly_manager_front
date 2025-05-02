<template>
  <Loading v-if="loading" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const loading = useLoading()
</script>
