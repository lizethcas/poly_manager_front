<template>
    <div class="img-gen-container">
        <h2>Generación de imágenes</h2>
        <div class="input-container">
            <input 
                v-model="prompt" 
                type="text" 
                placeholder="Describe la imagen que deseas generar"
                class="prompt-input"
            >
            <button 
                @click="generateImage" 
                :disabled="isLoading"
                class="generate-button"
            >
                {{ isLoading ? 'Generando...' : 'Generar' }}
            </button>
        </div>
        
        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="imageUrl" class="image-container">
            <img :src="imageUrl" alt="Imagen generada" class="generated-image">
        </div>
    </div>
</template>

<script>
import axiosInstance from '../../services/axios.config';

export default {
    name: 'ImgGen',
    data() {
        return {
            prompt: '',
            imageUrl: '',
            isLoading: false,
            error: ''
        }
    },
    methods: {
        async generateImage() {
            if (!this.prompt.trim()) {
                this.error = 'Por favor, ingresa una descripción';
                return;
            }

            this.isLoading = true;
            this.error = '';
            this.imageUrl = '';

            try {
                const response = await axiosInstance.post('img_gen/', {
                    prompt: this.prompt
                });

                if (response.data.url) {
                    this.imageUrl = response.data.url;
                } else {
                    this.error = response.data.error || 'Error al generar la imagen';
                }
            } catch (error) {
                this.error = error.response?.data?.error || 'Error de conexión al servidor';
                console.error('Error:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.img-gen-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.prompt-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.generate-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.generate-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.error-message {
    color: #ff0000;
    margin-bottom: 10px;
}

.image-container {
    margin-top: 20px;
}

.generated-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
