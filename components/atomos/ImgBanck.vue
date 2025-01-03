<template>
    <div>
        <h1>Banco de Imágenes</h1>
        <form @submit.prevent="submitForm">
            <div v-for="(image, index) in images" :key="index" class="image-item">
                <input type="file" @change="handleFileChange($event, index)" accept="image/*" />
                <input type="text" v-model="image.name" placeholder="Nombre de la imagen" />
                <input type="text" v-model="image.description" placeholder="Descripción de la imagen" />
                <button type="button" @click="removeImage(index)">Eliminar</button>
            </div>
            <button type="button" @click="addImage">Agregar otra imagen</button>
            <button type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Enviando...' : 'Guardar Imágenes' }}</button>
        </form>

        <h2>Imágenes Guardadas</h2>
        <div v-if="savedImages.length" class="saved-images-container">
            <div v-for="(img, index) in savedImages" :key="index" class="saved-image">
                <img :src="img.image" alt="Imagen guardada" style="max-width: 20px;" />
                <p>{{ img.description }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        classId: {
            type: [Number, String],
            required: true,
            default: null
        }
    },
    data() {
        return {
            images: [
                { file: null, name: '', description: '', preview: null }
            ],
            isSubmitting: false,
            savedImages: [],
            apiBaseUrl: process.env.NODE_ENV === 'development' 
                ? 'http://localhost:8000'
                : ''
        };
    },
    methods: {
        addImage() {
            this.images.push({ file: null, name: '', description: '', preview: null });
        },
        removeImage(index) {
            this.images.splice(index, 1);
            if (this.images.length === 0) {
                this.addImage();
            }
        },
        async handleFileChange(event, index) {
            const file = event.target.files[0];
            if (file) {
                this.images[index].file = file;
                this.images[index].preview = await this.getBase64(file);
            }
        },
        getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },
        async submitForm() {
            try {
                this.isSubmitting = true;

                if (!this.images.some(img => img.file && img.name && img.description)) {
                    throw new Error('Por favor, complete al menos una imagen con todos sus datos');
                }

                const contentData = {
                    class_id: 1,
                    content_type: 'image',
                    tittle: 'Banco de Imágenes',
                    content_details: {
                        images: await Promise.all(this.images
                            .filter(img => img.file && img.name && img.description)
                            .map(async (img) => ({
                                name: img.name,
                                description: img.description,
                                image: img.preview
                            })))
                    }
                };

                console.log('Enviando datos:', contentData);

                const response = await fetch(`${this.apiBaseUrl}/dashboard/api/class-contents/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contentData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error al guardar las imágenes');
                }

                this.$emit('success', result.data);
                alert('Imágenes guardadas correctamente');
                this.resetForm();
                this.fetchSavedImages();

            } catch (error) {
                console.error('Error:', error);
                alert('Error al guardar las imágenes: ' + error.message);
            } finally {
                this.isSubmitting = false;
            }
        },
        resetForm() {
            this.images = [{ file: null, name: '', description: '', preview: null }];
        },
        async fetchSavedImages() {
            try {
                const response = await fetch(`${this.apiBaseUrl}/dashboard/api/class-contents/?class_id=1`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    this.savedImages = data.data.map(item => {
                        if (item.content_details && item.content_details.images) {
                            return item.content_details.images;
                        }
                        return [];
                    }).flat();
                } else {
                    console.error('Error al obtener imágenes:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener imágenes guardadas:', error);
            }
        }
    },
    mounted() {
        this.fetchSavedImages();
    }
};
</script>

<style scoped>
.image-item {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

button[type="button"] {
    background-color: #2196F3;
}

input {
    margin: 0.5rem;
    padding: 0.5rem;
    width: calc(100% - 1rem);
}

.saved-image {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
}

.saved-images-container {
    display: flex;
    flex-wrap: wrap;
}

.saved-image {
    margin: 0.5rem;
    border: 1px solid #ddd;
}
</style>
