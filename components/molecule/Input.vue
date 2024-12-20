<!-- MoleculeBaseInput.vue -->
<template>
  <div :class="['gap-4 mb-4 w-full', containerClass]">
    <label v-if="!label" class="min-w-[70px] text-middele-gray text-sm">{{ props.title }}</label>
    <UInput v-if="type == 'text'" :type="type"  class="w-full" v-model="inputValue"
      :required="props.required" />
    <textarea v-if="type == 'text_area'" :size="size || 'xl'" v-model="inputValue" :class="['w-full resize-none p-3 border border-gray-300 rounded-md text-base', getHeightClass]"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import EventBus from '~/composables/useEvenBus';

const props = defineProps({
  label: Boolean,
  title: String,
  type: String,
  modelValue: String,
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xs' | 'xl',
    default: 'sm'
  },
  containerClass: {
    type: [String, Array, Object],
    default: 'flex'
  }

});


const emit = defineEmits(['update:modelValue']);
const inputValue = ref(props.modelValue)

const getHeightClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-8';
    case 'sm':
      return 'h-10';
    case 'md':
      return 'h-20';
    case 'lg':
      return 'h-32';
    case 'xl':
      return 'h-40';
    default:
      return 'h-8';
  }
});

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
  EventBus.emit('text-script', newValue);
});
</script>

