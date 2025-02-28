<template>
  <button
    :class="[
      customClass || 'bg-blue-500 text-white ',
      'flex items-center gap-2 px-2 py-1 rounded-full text-xs'
    ]"
    @click="handleClick"
  >
    <Icon :name="icon" size="16" :class="color || 'gray'" />

    <span class="text-xs">{{ label }}</span>
  </button>
</template>
<script setup lang="ts">
defineProps<{
  icon: string;
  label?: string;
  handleClick?: () => void;
  customClass?: string;
  color?: string;
}>();
</script>
