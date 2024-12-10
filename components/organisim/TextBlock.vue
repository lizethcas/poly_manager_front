<template>
    <div>
        <select v-model="selectedComponent">
            <option value="article">Artículo</option>
            <option value="column">Columna</option>
            <option value="list">Lista</option>
            <option value="quote">Quote</option>
            <option value="highlighted">Highlighted</option>
        </select>
        <TextBlockArticle v-if="selectedComponent === 'article'" />
        <TextBlockColumn v-else-if="selectedComponent === 'column'" />
        <TextBlockList v-else-if="selectedComponent === 'list'" />
        <TextBlockQuote v-else-if="selectedComponent === 'quote'" />
        <TextBlockHighlighted v-else-if="selectedComponent === 'highlighted'" />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref } from 'vue';
import TextBlockArticle from '~/components/organisim/TextBlockArticle.vue';
import TextBlockColumn from '~/components/organisim/TextBlockColumn.vue';
import TextBlockList from '~/components/organisim/TextBlockList.vue';
import TextBlockQuote from '~/components/organisim/TextBlockQuote.vue';
import TextBlockHighlighted from '~/components/organisim/TextBlockHighlighted.vue';
// Definir una referencia para el contenido del textarea
const textContent = ref('');
// Nueva referencia para el componente seleccionado
const selectedComponent = ref('article'); // Valor por defecto
</script>
