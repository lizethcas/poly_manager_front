<template>
  <UToggle v-model="selected" size="sm" :class="{
    'items-center': true,
    'bg-tarawera-700 text-white': selected, // Activo
    'bg-fuscous-gray-100 text-fuscous-gray-600': !selected // Inactivo
  }" />
</template>

<script setup lang="ts">
import EventBus from '~/composables/useEvenBus';

const selected = ref(false)

watch(selected, (value) => {
  EventBus.emit('toggle-selected', value);
});



</script>