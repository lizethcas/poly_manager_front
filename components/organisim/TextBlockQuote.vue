<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Text Quote:</h3>
        
        <!-- Renderizar los textareas dinámicamente -->
        <div v-for="(text, index) in textContents" :key="index" class="mb-4">
            <textarea 
                v-model="textContents[index]" 
                class="w-full h-32 border rounded p-2" 
                placeholder="Escribe tu texto aquí..."
            ></textarea>
            <InputFile type="image" />
        </div>
        
        <!-- Botón para agregar nuevos textareas -->
        <button 
            @click="addTextarea" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Add Quote
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputFile from '~/components/InputFile.vue';


// Array para gestionar el contenido de los textareas
const textContents = ref<string[]>([]);

// Función para agregar un nuevo textarea
const addTextarea = () => {
    textContents.value.push(''); // Añade un nuevo string vacío al array
};
</script>
