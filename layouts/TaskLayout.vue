<template>
    <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4 my-4" @click="emit('showEditNavigation')">
        <div class="flex justify-start gap-2">
            <p class="bg-tarawera-200 text-tarawera-800 px-2 py-1 rounded-md">{{ taskNumber }}.{{ index + 1 }}</p>
            <h3 class="text-lg font-bold">{{ capitalizeFirstLetter(title) }}</h3>
        </div>
        <p class="text-sm text-fuscous-gray-950">{{ description }}</p>
        <slot></slot>
    </div>
    <!-- <div class="shadow-md shadow-fuscous-gray-300 rounded-lg p-4 my-4" @click="emit('showEditNavigation')">
        <h2 class="text-md font-bold text-primary-color">{{ title }}</h2>
        <p class="text-sm text-fuscous-gray-950">{{ description }}</p>
        <slot></slot>
    </div> -->
   
    <!--  <button @click="emit('showEditNavigation')"
        class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">
        Add Block
    </button> -->
</template>

<script setup lang="ts">
import { useCapitalizerLetter } from '~/composables/useCapitalizerLetter';

const { capitalizeFirstLetter } = useCapitalizerLetter();
const taskNumber = ref(1);

const emit = defineEmits(['showEditNavigation'])

defineProps<{ title: string, description: string, index: number }>()
</script>
