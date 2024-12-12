<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Audio track:</h3>
        <InputFile type="audio" />
        <h3 class="text-s font-bold text-tarawera-700 my-4">Subtitle:</h3>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';

import { ref } from 'vue';


const formData = ref({
    title: '',
    instructions: ''
});
// Definir una referencia para el contenido del textarea
const textContent = ref('');
</script>
