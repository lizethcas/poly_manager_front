<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Embedded Video:</h3>
        <div class="flex flex-row items-start w-full">
            <h3 class="text-s font-bold text-tarawera-700 my-4">URL:</h3>
            <input v-model="videoLink" type="text" class="w-full border rounded p-2" placeholder="Enter video link..." />
        </div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" />

        <!-- Nuevo input para recibir un enlace -->
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref } from 'vue';

// Definir una referencia para el contenido del textarea
const textContent = ref('');
// Definir una referencia para el enlace del video
const videoLink = ref('');
</script>
