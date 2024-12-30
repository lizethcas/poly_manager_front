<template>
    <div class="speech-to-text">
        <button 
            @click="toggleRecording" 
            :class="{ 'recording': isRecording }"
        >
            {{ isRecording ? 'Detener Grabación' : 'Iniciar Grabación' }}
            <i class="fas fa-microphone"></i>
        </button>
        
        <textarea 
            v-model="transcribedText"
            placeholder="El texto transcrito aparecerá aquí..."
            rows="4"
            class="transcription-area"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '../../services/axios.config'

const isRecording = ref(false)
const transcribedText = ref('')
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

const toggleRecording = async () => {
    if (!isRecording.value) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })
            audioChunks = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                await sendAudioToServer(audioBlob)
                
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start(200)
            isRecording.value = true
        } catch (error) {
            console.error('Error al acceder al micrófono:', error)
            alert('No se pudo acceder al micrófono')
        }
    } else {
        mediaRecorder?.stop()
        isRecording.value = false
    }
}

const sendAudioToServer = async (audioBlob: Blob) => {
    try {
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')

        const response = await axiosInstance.post('/audio-transcription/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000
        })

        if (response.data.status === 'success') {
            transcribedText.value = response.data.data.transcription
        } else {
            throw new Error(response.data.message)
        }
    } catch (error: any) {
        console.error('Error al enviar el audio:', error)
        transcribedText.value = `Error: ${error.response?.data?.message || error.message}`
    }
}
</script>

<style scoped>
.speech-to-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}

button.recording {
    background-color: #f44336;
    animation: pulse 1.5s infinite;
}

.transcription-area {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: vertical;
    min-height: 100px;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
    100% {
        opacity: 1;
    }
}
</style>
