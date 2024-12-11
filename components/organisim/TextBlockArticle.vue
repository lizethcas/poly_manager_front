<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Text:</h3>
        <InputFile type="text_area" />
        <InputFile type="image" />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/molecule/InputFile.vue';
import { ref } from 'vue';

// Definir una referencia para el contenido del textarea
const textContent = ref('');



</script>

