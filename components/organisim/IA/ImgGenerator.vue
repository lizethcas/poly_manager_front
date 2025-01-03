<template>
    <div class="p-5 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-5">Generación de imágenes</h2>
        <div class="flex gap-4 mb-5">
            <input 
                v-model="prompt" 
                type="text" 
                placeholder="Describe la imagen que deseas generar"
                class="flex-1 p-2 border border-gray-300 rounded-md text-lg"
            >
            <button 
                @click="generateImage" 
                :disabled="isLoading"
                class="px-4 py-2 text-white rounded-md text-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {{ isLoading ? 'Generando...' : 'Generar' }}
            </button>
        </div>
        
        <div v-if="error" class="text-red-600 mb-4">
            {{ error }}
        </div>

        <div v-if="imageUrl" class="mt-5">
            <img :src="imageUrl" alt="Imagen generada" class="rounded-md shadow-md max-w-full h-auto">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosInstance from '~/services/axios.config';

const prompt = ref('');
const imageUrl = ref('');
const isLoading = ref(false);
const error = ref('');

const generateImage = async () => {
    if (!prompt.value.trim()) {
        error.value = 'Por favor, ingresa una descripción';
        return;
    }

    isLoading.value = true;
    error.value = '';
    imageUrl.value = '';

    try {
        const response = await axiosInstance.post('img_gen/', {
            prompt: prompt.value
        });

        if (response.data.url) {
            imageUrl.value = response.data.url;
        } else {
            error.value = response.data.error || 'Error al generar la imagen';
        }
    } catch (err) {
        error.value = err.response?.data?.error || 'Error de conexión al servidor';
        console.error('Error:', err);
    } finally {
        isLoading.value = false;
    }
};
</script>
