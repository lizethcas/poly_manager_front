<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video" />
        <h3 class="text-s font-bold text-tarawera-700 my-4">Subtitle:</h3>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref } from 'vue';

// Definir una referencia para el contenido del textarea
const textContent = ref('');
</script>
