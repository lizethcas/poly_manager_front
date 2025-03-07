<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
  </div>
  <div>
    <Calendar />
  </div>
</template>

<script setup lang="ts">
import Calendar from "~/components/Calendar.vue"; // Importar el componente del calendario

definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"]
});
</script>
