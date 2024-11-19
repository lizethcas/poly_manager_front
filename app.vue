<template>
  <div>
    <NuxtPage />
  </div>
  <SomeComponent  />
  <h1>{{ counter.count }}</h1>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/stores/count.store";

const counter = useCounterStore();
</script>

<style scoped>
body {
  font-size: 14px;
}
</style>