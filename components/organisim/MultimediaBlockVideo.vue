<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video" @file-selected="handleVideoUpload" />
        <h3 class="text-s font-bold text-tarawera-700 my-4">Subtitle:</h3>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" @file-selected="handleImageUpload" />
        
        <button 
            @click="saveToApi" 
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Guardar
        </button>
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref } from 'vue';

const textContent = ref('');
const mainVideoFile = ref(null);
const backgroundImageFile = ref(null);

// Agregar manejadores para los archivos
const handleVideoUpload = (file) => {
    mainVideoFile.value = file;
};

const handleImageUpload = (file) => {
    backgroundImageFile.value = file;
};

const saveToApi = async () => {
    console.log('Iniciando el guardado en la API...');
    
    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('script', textContent.value);
    if (mainVideoFile.value) {
        formData.append('video', mainVideoFile.value);
    }
    if (backgroundImageFile.value) {
        formData.append('cover', backgroundImageFile.value);
    }

    console.log('Datos a enviar:', Object.fromEntries(formData));

    try {
        const response = await fetch('http://localhost:8000/dashboard/api/multimediablockvideos/', {
            method: 'POST',
            // Eliminar el Content-Type header para que el navegador lo establezca automáticamente con el boundary correcto
            body: formData
        });

        console.log('Respuesta de la API:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al guardar:', errorText);
            throw new Error('Error al guardar');
        }

        alert('Guardado exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
};
</script>
