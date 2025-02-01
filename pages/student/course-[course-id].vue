<template>

  <Classes />
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"]
});
import Classes from "~/pages/student/classes.vue";
</script>
