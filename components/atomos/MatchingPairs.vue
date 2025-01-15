<template>
    <div>
        <h1>Matching Pairs</h1>
        <form @submit.prevent="submitForm">
            <div v-for="(pair, index) in pairs" :key="index" class="input-pair">
                <div class="pair-container">
                    <div class="input-group">
                        <select v-model="pair.type1" class="input-select">
                            <option value="text">Texto</option>
                            <option value="image">Imagen</option>
                            <option value="audio">Audio</option>
                        </select>
                        <div class="input-wrapper">
                            <input v-if="pair.type1 === 'text'" 
                                   v-model="pair.content1" 
                                   type="text" 
                                   :placeholder="'Input 1 - Pareja ' + (index + 1)" 
                                   class="input-field" />
                            <input v-if="pair.type1 === 'image'" 
                                   type="file" 
                                   @change="handleFileChange($event, index, 1)"
                                   accept="image/*" 
                                   class="input-field" />
                            <input v-if="pair.type1 === 'audio'" 
                                   type="file" 
                                   @change="handleFileChange($event, index, 1, 'audio')"
                                   accept="audio/*" 
                                   class="input-field" />
                        </div>
                    </div>
                    <div class="input-group">
                        <select v-model="pair.type2" class="input-select">
                            <option value="text">Texto</option>
                            <option value="image">Imagen</option>
                            <option value="audio">Audio</option>
                        </select>
                        <div class="input-wrapper">
                            <input v-if="pair.type2 === 'text'" 
                                   v-model="pair.content2" 
                                   type="text" 
                                   :placeholder="'Input 2 - Pareja ' + (index + 1)" 
                                   class="input-field" />
                            <input v-if="pair.type2 === 'image'" 
                                   type="file" 
                                   @change="handleFileChange($event, index, 2)"
                                   accept="image/*" 
                                   class="input-field" />
                            <input v-if="pair.type2 === 'audio'" 
                                   type="file" 
                                   @change="handleFileChange($event, index, 2, 'audio')"
                                   accept="audio/*" 
                                   class="input-field" />
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" @click="addPair" class="add-button">Agregar Pareja</button>
            <button type="submit" :disabled="isSubmitting" class="submit-button">
                {{ isSubmitting ? 'Enviando...' : 'Guardar Parejas' }}
            </button>
        </form>

        <!-- Sección para mostrar la última tarea guardada -->
        <div v-if="savedPairs.length" class="saved-pairs">
            <h2>Última Tarea Guardada</h2>
            <div v-for="(pair, index) in savedPairs" :key="index" class="saved-pair">
                <div class="pair-display">
                    <div class="pair-item">
                        <h4>Elemento 1:</h4>
                        <img v-if="pair.first.type === 'image'" 
                             :src="pair.first.content" 
                             alt="Imagen 1" 
                             class="preview-image" />
                        <audio v-if="pair.first.type === 'audio'" controls>
                            <source :src="pair.first.content" type="audio/mpeg">
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                        <span v-else-if="pair.first.type === 'text'">{{ pair.first.content }}</span>
                    </div>
                    <div class="pair-item">
                        <h4>Elemento 2:</h4>
                        <img v-if="pair.second.type === 'image'" 
                             :src="pair.second.content" 
                             alt="Imagen 2" 
                             class="preview-image" />
                        <audio v-if="pair.second.type === 'audio'" controls>
                            <source :src="pair.second.content" type="audio/mpeg">
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                        <span v-else-if="pair.second.type === 'text'">{{ pair.second.content }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pairs: [{ 
                type1: 'text', 
                type2: 'text',
                content1: '',
                content2: '',
                preview1: null,
                preview2: null
            }],
            isSubmitting: false,
            apiBaseUrl: process.env.NODE_ENV === 'development' 
                ? 'http://localhost:8000'
                : '',
            savedPairs: [],
        };
    },
    methods: {
        addPair() {
            this.pairs.push({ 
                type1: 'text', 
                type2: 'text',
                content1: '',
                content2: '',
                preview1: null,
                preview2: null
            });
        },
        async handleFileChange(event, index, inputNumber, type) {
            const file = event.target.files[0];
            if (file) {
                const preview = await this.getBase64(file);
                if (inputNumber === 1) {
                    this.pairs[index].content1 = type === 'audio' ? preview : file.name;
                    this.pairs[index].preview1 = type === 'audio' ? preview : file.name;
                } else {
                    this.pairs[index].content2 = type === 'audio' ? preview : file.name;
                    this.pairs[index].preview2 = type === 'audio' ? preview : file.name;
                }
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

                const contentData = {
                    class_id: 1, // ID genérico
                    content_type: 'matching',
                    tittle: 'Matching Pairs',
                    content_details: {
                        pairs: this.pairs.map(pair => ({
                            first: {
                                type: pair.type1,
                                content: pair.type1 === 'image' ? pair.preview1 : pair.content1
                            },
                            second: {
                                type: pair.type2,
                                content: pair.type2 === 'image' ? pair.preview2 : pair.content2
                            }
                        }))
                    }
                };

                const response = await fetch(`${this.apiBaseUrl}/dashboard/api/class-contents/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contentData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error al guardar las parejas');
                }

                this.$emit('success', result.data);
                alert('Parejas guardadas correctamente');
                this.resetForm();

            } catch (error) {
                console.error('Error:', error);
                alert('Error al guardar las parejas: ' + error.message);
            } finally {
                this.isSubmitting = false;
            }
        },
        resetForm() {
            this.pairs = [{
                type1: 'text',
                type2: 'text',
                content1: '',
                content2: '',
                preview1: null,
                preview2: null
            }];
        },
        async fetchSavedPairs() {
            try {
                const response = await fetch(`${this.apiBaseUrl}/dashboard/api/class-contents/?class_id=1`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    const matchingContents = data.data.filter(item => item.content_type === 'matching');
                    if (matchingContents.length > 0) {
                        const lastContent = matchingContents[matchingContents.length - 1];
                        this.savedPairs = lastContent.content_details.pairs;
                    }
                }
            } catch (error) {
                console.error('Error al obtener parejas guardadas:', error);
            }
        }
    },
    mounted() {
        this.fetchSavedPairs();
    }
};
</script>

<style scoped>
.input-pair {
    margin-bottom: 20px; /* Espacio entre parejas */
}

.pair-container {
    display: flex;
    align-items: center; /* Alinea verticalmente los elementos */
    gap: 15px; /* Espacio entre los elementos */
}

.input-group {
    display: flex;
    align-items: center; /* Alinea verticalmente los elementos */
    gap: 10px; /* Espacio entre el selector y el input */
}

.input-select {
    width: 100px; /* Ancho fijo para el selector */
}

.input-wrapper {
    flex: 1; /* Permite que los inputs ocupen el espacio disponible */
}

.input-field {
    width: 100%; /* Hace que los inputs ocupen todo el ancho disponible */
    padding: 8px; /* Espaciado interno para mayor comodidad */
    border: 1px solid #ccc; /* Borde ligero */
    border-radius: 4px; /* Bordes redondeados */
}

.add-button {
    margin-top: 20px; /* Espacio superior para el botón */
    padding: 10px 15px; /* Espaciado interno del botón */
    background-color: #007bff; /* Color de fondo del botón */
    color: white; /* Color del texto del botón */
    border: none; /* Sin borde */
    border-radius: 4px; /* Bordes redondeados */
    cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
}

.add-button:hover {
    background-color: #0056b3; /* Color de fondo al pasar el mouse */
}

.submit-button {
    margin-top: 20px; /* Espacio superior para el botón */
    padding: 10px 15px; /* Espaciado interno del botón */
    background-color: #28a745; /* Color de fondo del botón */
    color: white; /* Color del texto del botón */
    border: none; /* Sin borde */
    border-radius: 4px; /* Bordes redondeados */
    cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
}

.submit-button:hover {
    background-color: #218838; /* Color de fondo al pasar el mouse */
}

.saved-pairs {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.saved-pair {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.pair-display {
    max-width: 200px;
    display: flex;
    gap: 2rem;
    align-items: center;
}

.pair-item {
    flex: 1;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
}

.preview-image {
    max-width: 20px;
    max-height: 20px;
    object-fit: contain;
}

h4 {
    margin: 0 0 0.5rem 0;
    color: #666;
}
</style>