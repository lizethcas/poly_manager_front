<template>
  <div class="flex items-center gap-4">
    <label v-if="!label" class="min-w-[120px] text-middele-gray">{{
      title
    }}</label>
    <div class="text-primary-color">
      <USelect
        v-model="selectedOption"
        :options="options"
        @update:modelValue="handleChange"
        variant="outline"
        size="xs"
        class="bg-gray-100"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { ModalProps } from "~/interfaces/modal.interface";
const props = defineProps<
  ModalProps & {
    modelValue?: string;
    label?: boolean;
    title?: string;
  }
>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const selectedOption = ref(props.modelValue || props.options?.[0] || "");

const handleChange = (value: string) => {
  selectedOption.value = value;
  emit("update:modelValue", value);
};

watch(
  () => props.options,
  (newOptions) => {
    if (newOptions?.length) {
      selectedOption.value = props.modelValue || newOptions[0];
      emit("update:modelValue", selectedOption.value);
    }
  },
  { immediate: true }
);
</script>
