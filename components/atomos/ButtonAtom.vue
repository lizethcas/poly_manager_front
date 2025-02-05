<template>
    <!-- Button component that renders based on filtered type with customizable text and default styling -->
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

// Define available button configurations with their respective properties
const buttons: ButtonAtomProps[] = [
    // Crop button configuration
    { type: 'crop', icon: 'ic:baseline-crop', size: 's', defaultLabel: 'crop' },
    // Delete button configuration
    { type: 'delete', icon: 'i-heroicons-trash', size: 's', defaultLabel: 'delete' },
    // Swap button configuration
    { type: 'swap', icon: 'system-uicons:swap', size: 's', defaultLabel: 'swap' },
    // Edit button configuration
    { type: 'edit', icon: 'basil:edit-solid', size: 's', defaultLabel: 'edit' },
    // Preview button configuration
    { type: 'preview', icon: 'mdi:eye', size: 's', defaultLabel: 'preview' },
];

// Computed property that filters buttons based on the provided type prop
const filteredButtons = computed(() => {
    return buttons.filter(btn => type === btn.type);
});

</script>
