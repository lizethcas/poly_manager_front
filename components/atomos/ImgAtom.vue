<template>
    <img :src="image" :alt="alt" class="w-full h-auto object-cover" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ImgAtomProps } from '~/interfaces/props.components.interface';


// Usar defineProps con los tipos definidos
const { image, alt } = defineProps<ImgAtomProps>()
</script>
