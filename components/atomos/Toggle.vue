<template>
  <UToggle v-model="selected" size="sm" :class="{
    'items-center': true,
    'bg-tarawera-700 text-white': selected, // Activo
    'bg-fuscous-gray-100 text-fuscous-gray-600': !selected // Inactivo
  }" />
</template>

<script setup lang="ts">
const selected = ref(false)
</script>