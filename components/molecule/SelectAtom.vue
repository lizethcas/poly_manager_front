<template>
    <div class="flex items-center gap-4 mb-4 w-full">
        <label class="min-w-[120px] text-middele-gray">{{ title }}</label>
        <div class="w-5/12 text-fresh-green">
            <USelect 
                v-model="selectedOption" 
                :options="options" 
                @update:modelValue="handleChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { ModalProps } from '~/interfaces/modal.interface';

const props = defineProps<ModalProps & {
    modelValue?: string
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>();

const selectedOption = ref(props.modelValue || props.options?.[0] || "");

const handleChange = (value: string) => {
    selectedOption.value = value;
    emit('update:modelValue', value);
};

watch(
    () => props.options,
    (newOptions) => {
        if (newOptions?.length) {
            selectedOption.value = props.modelValue || newOptions[0];
            emit('update:modelValue', selectedOption.value);
        }
    },
    { immediate: true }
);
</script>
