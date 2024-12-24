<template>
  <UToggle v-model="selected" size="sm" :class="{
    'z-0': true,
    'items-center': true,
    'bg-tarawera-700 text-white': selected, // Activo
    'bg-fuscous-gray-100 text-fuscous-gray-600': !selected // Inactivo
  }" @click="$emit('update:modelValue', !selected)" />
</template>

<script setup lang="ts">


const selected = ref(false)

defineEmits(['update:modelValue'])



</script>