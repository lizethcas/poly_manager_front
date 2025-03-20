<template>
  <h1>my notes</h1>
  <Calendar2 />
</template>
<script>

import Calendar2 from '~/components/Calendar2.vue';
definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"]
});
</script>
