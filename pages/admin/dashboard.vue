<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
  </div>

  <!-- <Calendar2 /> -->

  <Calendar/>



</template>

<script setup lang="ts">
import Calendar2 from '~/components/Calendar2.vue';
import Calendar from '~/components/Calendar.vue';
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"]
});
</script>
