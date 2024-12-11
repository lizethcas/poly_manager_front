<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Text Column:</h3>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Escribe tu texto aquí..."></textarea>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Escribe tu texto aquí..."></textarea>
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref } from 'vue';

// Definir una referencia para el contenido del textarea
const textContent = ref('');
</script>
