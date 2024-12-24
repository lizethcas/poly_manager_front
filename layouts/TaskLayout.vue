<template>
  <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4 my-">
    <h2 class="text-md font-bold text-primary-color">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
