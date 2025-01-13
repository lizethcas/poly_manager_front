<!-- MoleculeBaseInput.vue -->
<template>
  <div :class="['gap-4 mb-4 w-full', containerClass]">
    <label v-if="!label" class="min-w-[70px] text-middele-gray text-sm">{{ props.title }}</label>
    <UInput v-if="type == 'text'" :type="type"  class="w-full" v-model="inputValue"
      :required="props.required" :placeholder="placeholder" />
    <textarea  v-if="type == 'text_area'" :size="size || 'xl'" :value="modelValue"
      @input="handleInput"
      ref="textareaRef"
      :placeholder="placeholder"
      :class="['w-full resize-none p-3 border border-gray-300 rounded-md text-base', getHeightClass]"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, computed, nextTick } from 'vue';
import EventBus from '~/composables/useEvenBus';

const props = defineProps({
  label: Boolean,
  title: String,
  type: String,
  modelValue: String,
  placeholder: String,
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
const inputValue = ref(props.modelValue || '')

const getHeightClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-8';
    case 'sm':
      return 'h-10';
    case 'md':
      return 'h-32';
    case 'lg':
      return 'h-40';
    case 'xl':
      return 'h-60';
    default:
      return 'h-8';
  }
});

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
  EventBus.emit('text-script', newValue);
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

// Add method to handle text insertion
const insertTextAtCursor = (text: string) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  const currentValue = textarea.value;
  
  const newValue = currentValue.substring(0, startPos) + 
                   text + 
                   currentValue.substring(endPos);
                   
  emit('update:modelValue', newValue);
  
  // Set cursor position after inserted text
  nextTick(() => {
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.focus();
  });
};

// Expose the method to parent components
defineExpose({ insertTextAtCursor });
</script>

