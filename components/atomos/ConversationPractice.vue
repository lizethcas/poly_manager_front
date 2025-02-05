<template>
    <div class="conversation-practice">
        <!-- Sección del tema de conversación -->
        <div class="topic-section">
            <button 
                @click="getNewTopic" 
                class="topic-button"
                :disabled="isRecording"
            >
                Obtener Nuevo Tema
            </button>
            <div v-if="currentTopic" class="topic-display">
                <h3>Tema de conversación:</h3>
                <p>{{ currentTopic }}</p>
            </div>
        </div>

        <!-- Historial de conversación -->
        <div class="conversation-history">
            <div v-for="(message, index) in conversationHistory" 
                :key="index" 
                :class="['message', message.role]"
            >
                <div class="message-content">
                    <div class="message-header">
                        <strong>{{ message.role === 'user' ? 'Tú' : 'POLLY' }}:</strong>
                        <div class="message-controls">
                            <div class="audio-controls" v-if="message.role === 'user' && message.audio">
                                <button 
                                    @click="playUserAudio(message.audio)"
                                    class="play-button"
                                >
                                    <i class="fas fa-play"></i>
                                </button>
                                <button 
                                    v-if="message.pronunciation"
                                    @click="togglePronunciationAnalysis(index)"
                                    class="analysis-button"
                                    :class="{ 'active': selectedAnalysisIndex === index }"
                                >
                                    <i class="fas fa-chart-bar"></i>
                                </button>
                            </div>
                            <button 
                                v-if="message.role === 'assistant'"
                                @click="speakText(message.content)"
                                class="play-button"
                                :disabled="isSpeaking"
                            >
                                <i :class="['fas', isSpeaking ? 'fa-stop' : 'fa-play']"></i>
                            </button>
                        </div>
                    </div>
                    <p>{{ message.content }}</p>
                    
                    <div v-if="selectedAnalysisIndex === index && message.pronunciation" 
                         class="pronunciation-analysis"
                    >
                        <h4>Análisis de Pronunciación</h4>
                        <div class="analysis-content">
                            <p><strong>Feedback:</strong> {{ message.pronunciation.feedback }}</p>
                            <div class="improvements">
                                <strong>Áreas de mejora:</strong>
                                <ul>
                                    <li v-for="(improvement, i) in message.pronunciation.improvements" 
                                        :key="i"
                                    >
                                        {{ improvement }}
                                    </li>
                                </ul>
                            </div>
                            <div class="score">
                                <strong>Puntuación:</strong> 
                                <span :class="getScoreClass(message.pronunciation.score)">
                                    {{ message.pronunciation.score }}/10
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Control de grabación -->
        <div class="recording-controls">
            <button 
                @click="toggleRecording" 
                :class="{ 'recording': isRecording }"
            >
                {{ isRecording ? 'Detener Grabación' : 'Grabar Respuesta' }}
                <i class="fas fa-microphone"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
// Importaciones y configuración inicial
import { ref, onBeforeUnmount } from 'vue'
import axiosInstance from '../../services/axios.config'

// Referencias reactivas y variables de estado
const isRecording = ref(false)
const currentTopic = ref('')
const conversationHistory = ref<Array<{
    role: string, 
    content: string,
    audio?: Blob,
    pronunciation?: any
}>>([])
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
const isSpeaking = ref(false)
let speechSynthesis: SpeechSynthesis | null = null
let speechUtterance: SpeechSynthesisUtterance | null = null

// Inicializar speechSynthesis
if (typeof window !== 'undefined') {
    speechSynthesis = window.speechSynthesis
}

// Función principal para obtener nuevo tema de conversación desde la API
const getNewTopic = async () => {
    try {
        const response = await axiosInstance.post('/ask-openai/', {
            question: "Actúa como profesora de idiomas. Propón un tema de conversación interesante y hazme una pregunta al respecto. La respuesta debe ser breve y natural, te presentaras como POLLY y mensionaras que estas aquí para ayudar a mejorar tu pronunciación, propon temas navideños, puedes hablar de los viajes de Mark y Angélica, es importante mencionar a Mark y Angélica"
        })
        currentTopic.value = response.data.answer
        conversationHistory.value = [{
            role: 'assistant',
            content: response.data.answer
        }]
    } catch (error) {
        console.error('Error al obtener tema:', error)
        currentTopic.value = 'Error al obtener tema de conversación'
    }
}

// Sistema de grabación de audio del usuario
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
                await sendAudioAndGetResponse(audioBlob)
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

// Procesa el audio grabado y obtiene respuestas
const sendAudioAndGetResponse = async (audioBlob: Blob) => {
    try {
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')

        const transcriptionResponse = await axiosInstance.post('/audio-transcription/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000
        })


        if (transcriptionResponse.data.status === 'success') {
            const { transcription, pronunciation_analysis } = transcriptionResponse.data.data
            
            // Intentar parsear el análisis de pronunciación de manera segura
            let analysis = null
            try {
                analysis = JSON.parse(pronunciation_analysis)
            } catch (parseError) {
                console.error('Error al parsear el análisis:', parseError)  // Log de error de parseo
                console.warn('Contenido que no se pudo parsear:', pronunciation_analysis)
                analysis = {
                    feedback: 'No se pudo analizar la pronunciación',
                    improvements: [],
                    score: 0
                }
            }
            
            // Agregar mensaje del usuario con el audio y análisis
            conversationHistory.value.push({
                role: 'user',
                content: transcription,
                audio: audioBlob,
                pronunciation: analysis
            })

            // Obtener respuesta de la AI
            const aiResponse = await axiosInstance.post('/ask-openai/', {
                question: `Actúa como profesor de idiomas. Responde de manera natural y breve a este mensaje: "${transcription}". 
                          La respuesta debe ser conversacional y fomentar que la persona siga hablando.`
            })

            // Agregar respuesta de la AI
            conversationHistory.value.push({
                role: 'assistant',
                content: aiResponse.data.answer
            })
        }
    } catch (error: any) {
        console.error('Error completo en la conversación:', error)  // Log detallado del error
        conversationHistory.value.push({
            role: 'system',
            content: 'Error en el procesamiento del mensaje'
        })
    }
}

// Sistema de texto a voz para respuestas del asistente
const speakText = (text: string) => {
    if (!speechSynthesis) return

    // Si ya está hablando, detener
    if (isSpeaking.value) {
        speechSynthesis.cancel()
        isSpeaking.value = false
        return
    }

    // Crear nueva utterance
    speechUtterance = new SpeechSynthesisUtterance(text)
    
    // Configurar voz en español
    const voices = speechSynthesis.getVoices()
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'))
    if (spanishVoice) {
        speechUtterance.voice = spanishVoice
    }
    
    // Configurar otros parámetros
    speechUtterance.rate = 1.0  // Velocidad normal
    speechUtterance.pitch = 1.0 // Tono normal
    speechUtterance.volume = 1.0 // Volumen máximo
    
    // Eventos
    speechUtterance.onstart = () => {
        isSpeaking.value = true
    }
    
    speechUtterance.onend = () => {
        isSpeaking.value = false
    }
    
    speechUtterance.onerror = (event) => {
        console.error('Error en la síntesis de voz:', event)
        isSpeaking.value = false
    }

    // Reproducir
    speechSynthesis.speak(speechUtterance)
}

// Funciones de utilidad para reproducción y análisis
const playUserAudio = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    audio.play()
    
    // Limpiamos la URL cuando termine la reproducción
    audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
    }
}

// Control de visualización del análisis de pronunciación
const selectedAnalysisIndex = ref<number | null>(null)
const togglePronunciationAnalysis = (index: number) => {
    selectedAnalysisIndex.value = selectedAnalysisIndex.value === index ? null : index
}

// Utilidad para clasificación visual de puntuaciones
const getScoreClass = (score: number) => {
    if (score >= 8) return 'score-high'
    if (score >= 6) return 'score-medium'
    return 'score-low'
}

// Limpiar síntesis de voz al desmontar el componente
onBeforeUnmount(() => {
    if (speechSynthesis && isSpeaking.value) {
        speechSynthesis.cancel()
    }
})
</script>

<style scoped>
.conversation-practice {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
}

.topic-section {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.topic-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.topic-button:hover {
    background-color: #45a049;
}

.topic-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.conversation-history {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.message {
    padding: 0.75rem;
    border-radius: 8px;
    max-width: 80%;
}

.message.user {
    align-self: flex-end;
    background-color: #e3f2fd;
}

.message.assistant {
    align-self: flex-start;
    background-color: #f5f5f5;
}

.message.system {
    align-self: center;
    background-color: #ffebee;
    color: #c62828;
}

.recording-controls button {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.3s;
}

.recording-controls button.recording {
    background-color: #f44336;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

.message-content {
    width: 100%;
}

.message-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    padding: 0.5rem;
}

.play-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: auto;
}

.play-button:hover {
    background-color: #45a049;
}

.play-button:disabled {
    background-color: #cccccc;
}

.audio-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
}

.message-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
}

.analysis-button {
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.analysis-button:hover {
    background-color: #1976D2;
}

.analysis-button.active {
    background-color: #1565C0;
}

.pronunciation-analysis {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.analysis-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.improvements ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.score {
    font-size: 1.1em;
}

.score-high {
    color: #4CAF50;
    font-weight: bold;
}

.score-medium {
    color: #FFC107;
    font-weight: bold;
}

.score-low {
    color: #F44336;
    font-weight: bold;
}
</style> 