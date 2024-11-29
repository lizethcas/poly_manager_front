<template>
    <UButton v-for="btn in filteredButtons" :key="btn.type" size="xs" :icon="btn.icon" :label="text || btn.defaultLabel"
        :trailing="false" color="gray" @click="handleClick" class="hover:border-gray-500 w-full mb-2 " />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { ButtonAtomProps } from '~/interfaces/components/props.components.interface';

const { text, type } = defineProps<ButtonAtomProps>();
const emits = defineEmits(['handleClick']);

const handleClick = () => {
    emits('handleClick');
}

const buttons: ButtonAtomProps[] = [
    { type: 'crop', icon: 'ic:baseline-crop', size: 's', defaultLabel: 'crop' },
    { type: 'delete', icon: 'i-heroicons-trash', size: 's', defaultLabel: 'delete' },
    { type: 'swap', icon: 'system-uicons:swap', size: 'sm', defaultLabel: 'swap' },
    { type: 'edit', icon: 'basil:edit-solid', size: 'sm', defaultLabel: 'edit' },
    { type: 'preview', icon: 'mdi:eye', size: 'sm', defaultLabel: 'preview' },
];

// Filtra los botones que coinciden con el tipo
const filteredButtons = computed(() => {
    return buttons.filter(btn => type === btn.type);
});

</script>
