<template>
  <NuxtLayout>
    <OrganisimTextBlockModules :selected-task="selectedTask" />
  </NuxtLayout>
</template>
<script setup lang="ts">
// Get the selected task from props
defineProps<{
  selectedTask?: String
}>();


// Watch both the prop and the store

</script>
