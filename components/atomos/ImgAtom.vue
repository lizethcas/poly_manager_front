<template>
    <img :src="image" :alt="alt" class="w-full h-auto object-cover flex items-center" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ImgAtomProps } from '~/interfaces/components/props.components.interface';


// Usar defineProps con los tipos definidos
const { image, alt } = defineProps<ImgAtomProps>()
</script>
