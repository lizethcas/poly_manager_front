<!-- MoleculeBaseInput.vue -->
<template>
  <div :class="['gap-4 mb-4 w-full', containerClass]">
    <label v-if="!label" class="min-w-[120px] text-middele-gray text-sm">{{ props.title }}</label>
    <UInput v-if="type == 'text'" :type="type" :size="size || 'xs'" class="w-full" v-model="inputValue"
      :required="props.required" />
    <UTextarea v-if="type == 'text_area'" :size="size || 'xs'" v-model="inputValue" class="w-full" />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
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
    type: String as () => 'sm' | 'md' | 'lg' | 'xs',
    default: 'sm'
  },
  containerClass: {
    type: [String, Array, Object],
    default: 'flex'
  }

});


const emit = defineEmits(['update:modelValue']);
const inputValue = ref(props.modelValue)

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
  EventBus.emit('text-script', newValue);
});
</script>

