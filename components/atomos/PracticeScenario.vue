<template>
    <h1>Mi zona de practica</h1>
    <div class="practice-scenario">
        <div class="scenario-info">
            <h1>{{ scenario.name }}</h1>
            <p class="location">{{ scenario.location }}</p>
            <p class="description">{{ scenario.description }}</p>
            
            <!-- Información del rol del estudiante -->
            <div class="role-info">
                <h3>Tu rol:</h3>
                <p>{{ scenario.role_student }}</p>
            </div>
        </div>

        <div class="chat-container">
            <div class="chat-messages" ref="chatMessages">
                <div v-for="(message, index) in chatHistory" 
                     :key="index" 
                     :class="['message', message.role]">
                    <p>{{ message.content }}</p>
                    <div v-if="message.role === 'assistant'" class="message-controls">
                        <TextToSpeech 
                            :key="`audio-${index}`"
                            :initial-text="message.content"
                            class="message-audio-controls"
                        />
                    </div>
                </div>
            </div>

            <div class="chat-input">
                <textarea 
                    v-model="userMessage" 
                    @keyup.enter="sendMessage"
                    placeholder="Escribe tu mensaje..."
                    rows="3"
                ></textarea>
                <div class="input-buttons">
                    <button @click="sendMessage" :disabled="isLoading || !chatSocket">
                        {{ isLoading ? 'Enviando...' : 'Enviar' }}
                    </button>
                    <button 
                        @click="toggleRecording" 
                        :class="{ 'recording': isRecording }"
                        :disabled="isLoading"
                        type="button"
                    >
                        <i class="fas fa-microphone"></i>
                        {{ isRecording ? 'Detener' : 'Grabar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Importar la configuración de URLs
import axiosInstance from '@/services/axios.config';
import TextToSpeech from './TextToSpech.vue'

export default {
    name: 'PracticeScenario',
    components: {
        TextToSpeech
    },
    props: {
        scenario: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chatHistory: [],
            userMessage: '',
            isLoading: false,
            chatSocket: null,
            isRecording: false,
            mediaRecorder: null,
            audioChunks: [],
        }
    },
    methods: {
        connectWebSocket() {
            const roomName = 'lobby';
            const scenarioId = this.scenario.id;
            
            const baseUrl = process.env.NODE_ENV === 'development' 
                ? 'localhost:8000'
                : 'dploy-production.up.railway.app';
            
            const wsScheme = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            const wsUrl = `${wsScheme}${baseUrl}/ws/chat/${roomName}/${scenarioId}/`;
            
            console.log('Intentando conectar WebSocket a:', wsUrl);

            this.chatSocket = new WebSocket(wsUrl);

            this.chatSocket.onopen = () => {
                console.log('WebSocket conectado exitosamente');
            };

            this.chatSocket.onmessage = (e) => {
                console.log('Mensaje recibido:', e.data);
                const data = JSON.parse(e.data);
                
                const isDuplicate = this.chatHistory.some(msg => 
                    msg.role === 'assistant' && msg.content === data.message
                );
                
                if (!isDuplicate) {
                    this.chatHistory.push({
                        role: 'assistant',
                        content: data.message
                    });
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                }
            };

            this.chatSocket.onclose = (e) => {
                console.log('WebSocket cerrado. Código:', e.code, 'Razón:', e.reason); // Debug detallado
                setTimeout(() => {
                    console.log('Intentando reconexión...'); // Debug
                    this.connectWebSocket();
                }, 3000);
            };

            this.chatSocket.onerror = (e) => {
                console.error('Error en WebSocket:', e); // Debug
                // Agregar más detalles del error si están disponibles
                if (e.message) console.error('Mensaje de error:', e.message);
                if (e.error) console.error('Error detallado:', e.error);
            };
        },

        async sendMessage() {
            if (!this.userMessage.trim() || this.isLoading || !this.chatSocket) return;

            try {
                this.isLoading = true;
                
                // Agregar mensaje del usuario al historial
                this.chatHistory.push({
                    role: 'user',
                    content: this.userMessage
                });

                // Enviar mensaje a través del WebSocket
                this.chatSocket.send(JSON.stringify({
                    'message': this.userMessage
                }));

                // Limpiar el mensaje
                this.userMessage = '';
                
                // Scroll al último mensaje
                this.$nextTick(() => {
                    this.scrollToBottom();
                });

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
            } finally {
                this.isLoading = false;
            }
        },

        scrollToBottom() {
            const chatMessages = this.$refs.chatMessages;
            if (chatMessages) {  // Verificar que chatMessages no sea null
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                console.warn('chatMessages no está disponible en scrollToBottom');
            }
        },

        async toggleRecording() {
            if (!this.isRecording) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    this.mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm'
                    });
                    this.audioChunks = [];

                    this.mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            this.audioChunks.push(event.data);
                        }
                    };

                    this.mediaRecorder.onstop = async () => {
                        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                        await this.sendAudioToServer(audioBlob);
                        stream.getTracks().forEach(track => track.stop());
                    };

                    this.mediaRecorder.start(200);
                    this.isRecording = true;
                } catch (error) {
                    console.error('Error al acceder al micrófono:', error);
                    alert('No se pudo acceder al micrófono');
                }
            } else {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.mediaRecorder.stop();
                }
                this.isRecording = false;
            }
        },

        async sendAudioToServer(audioBlob) {
            try {
                this.isLoading = true;
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.webm');

                const response = await axiosInstance.post('/audio-transcription/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000
                });

                if (response.data.status === 'success') {
                    // Establecer el texto transcrito como mensaje del usuario
                    this.userMessage = response.data.data.transcription;
                    // Enviar el mensaje automáticamente
                    await this.sendMessage();
                } else {
                    throw new Error(response.data.message || 'Error en la transcripción');
                }
            } catch (error) {
                console.error('Error al enviar el audio:', error);
                alert('Error al procesar el audio: ' + (error.response?.data?.message || error.message));
            } finally {
                this.isLoading = false;
            }
        },
    },
    mounted() {
        this.connectWebSocket();
    },
    beforeUnmount() {
        if (this.chatSocket) {
            this.chatSocket.close();
        }
    }
}
</script>

<style scoped>
.practice-scenario {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.scenario-info {
    margin-bottom: 30px;
}

.chat-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    height: 500px;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
}

.message {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
    max-width: 80%;
}

.message.user {
    background-color: #e3f2fd;
    margin-left: auto;
}

.message.assistant {
    background-color: #f5f5f5;
    margin-right: auto;
}

.chat-input {
    padding: 15px;
    border-top: 1px solid #ddd;
    display: flex;
    gap: 10px;
}

textarea {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
}

button {
    padding: 10px 20px;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
}

.input-buttons {
    display: flex;
    gap: 10px;
}

button.recording {
    background-color: #f44336;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

.audio-controls {
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: #f9f9f9;
}

.message-controls {
    margin-top: 5px;
}

.audio-button {
    background-color: transparent;
    color: #1976d2;
    border: 1px solid #1976d2;
    padding: 5px 10px;
    font-size: 0.9em;
    cursor: pointer;
}

.audio-button:hover {
    background-color: #e3f2fd;
}

.message-audio-controls {
    margin-top: 8px;
}
</style>