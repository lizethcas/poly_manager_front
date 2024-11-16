<!-- MoleculeBaseInput.vue -->
<template>
  <div class="flex items-center gap-4 mb-4 w-full">
    <label for="" class="min-w-[120px] text-middele-gray">{{ props.title }}</label>
    <UInput v-if="type == 'text'" :type="type" size="xl" class="w-full" v-model="inputValue" />
    <UTextarea v-if="type == 'text_area'" v-model="inputValue" class="w-full" />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';
const inputValue = ref('');

const props = defineProps({
  title: String,
  type: String
});


const emit = defineEmits(['update:modelValue']);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
