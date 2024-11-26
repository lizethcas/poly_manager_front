<template>
  <BaseTaskModal
    :is-open="isOpen"
    :model-value="modelValue"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <!-- Add video-specific form fields here -->
  </BaseTaskModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  modelValue: Record<string, any>;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'submit'): void;
}>();
</script> 