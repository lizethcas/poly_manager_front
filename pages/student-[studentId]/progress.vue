<template>
  <div>
    <h1>Progress</h1>
    <Calendar2 />
  </div>
</template>
<script setup lang="ts">
  import Calendar2 from '~/components/Calendar2.vue';
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"]
});
</script>
