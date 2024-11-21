<template>
    <UButton v-if="type == 'crop'" icon="ic:baseline-crop" size="sm" variant="solid" :label="text || 'crop'"
        :type="type" :trailing="false" />

    <UButton v-if="type === 'delete'" icon="i-heroicons-trash" size="sm" color="primary" variant="solid"
        :label="text || 'delete'" :trailing="false" />

    <UButton v-if="type === 'swap'" icon="mdi:swap-vertical" size="sm" color="primary" variant="solid"
        :label="text || 'swap'" :trailing="false" />
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
import type { ButtonAtomProps } from '~/interfaces/props.components.interface';

const { text, type } = defineProps<ButtonAtomProps>()
</script>
