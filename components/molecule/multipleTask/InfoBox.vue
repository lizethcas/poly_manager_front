<template>
  <div class="flex items-center py-4">
    <button 
      v-for="type in infoTypes"
      :key="type.value"
      class="px-4 py-2 border transition-colors"
      :class="[
        modelValue === type.value
          ? 'bg-primary-color text-white' 
          : 'bg-white text-primary-color',
        getBorderClasses(type.value)
      ]"
      @click="$emit('update:modelValue', type.value)"
    >
      {{ type.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>();

defineEmits<{
  'update:modelValue': [value: string]
}>();

const infoTypes = [
  { value: 'attention', label: 'Attention' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'tip', label: 'Tip' }
];

const getBorderClasses = (type: string) => {
  if (type === 'attention') return 'border-tarawera-950 rounded-l-md';
  if (type === 'grammar') return 'border-t border-b border-tarawera-950';
  if (type === 'tip') return 'border-blue-500 rounded-r-md';
  return '';
};
</script>

