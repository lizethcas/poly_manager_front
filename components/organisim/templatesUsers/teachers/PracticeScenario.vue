<template>
  <div
    class="fixed inset-0 bg-opacity-0 z-50"
    :style="{
      backgroundImage: `url(${scenario.cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <!-- Welcome screen -->
    <div
      v-if="!chatStarted"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 h-screen flex items-center justify-start"
    >
      <img
        src="~/assets/images/teacher.png"
        class="w-38"
        alt="Virtual teacher assistant"
      />
      <div class="prose lg:prose-xl bg-white rounded-lg p-4 max-w-2xl text-center">
        <h2 class="welcome-title">Let's talk!</h2>
        <div class="welcome-content">
          <h3 class="text-m font-bold">🎉 {{ scenario.name }} 🎉</h3>
          <p class="text-base">
            {{ scenario.description }}
          </p>
          <button @click="startChat" class="start-button m-auto">START</button>
        </div>
      </div>
    </div>

    <!-- Chat interface -->
    <div
      v-else
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 h-screen flex items-center justify-start"
    >
      <img
        src="~/assets/images/teacher.png"
        class="max-w-82"
        alt="Virtual teacher assistant"
      />
     <!--  <div class="scenario-info">
        <h1>{{ scenario.name }}</h1>
        <p class="location">{{ scenario.location }}</p>
        <p class="description">{{ scenario.description }}</p>
      </div> -->

      <div class="chat-container w-full">
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-content">
              {{ message.content }}
              <!-- Add control buttons inside the last assistant message -->
              <div 
                v-if="canEndConversation && index === chatHistory.length - 1 && message.role === 'assistant'"
                class="message-controls"
              >
                <button 
                  @click="endConversation"
                  class="message-control-button"
                  :disabled="isLoading"
                >
                  <i class="fas fa-check mr-1"></i>
                  Finish
                </button>
                <button 
                  class="message-control-button"
                  @click="startOver"
                  :disabled="isLoading"
                >
                  <i class="fas fa-undo mr-1"></i>
                  Start over
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="userMessage"
            @keyup.enter="sendMessage"
            placeholder="Message..."
            rows="3"
            class="bg-white opacity-50 focus:outline-none rounded-lg"
            :class="{'input-expanded': activeButton === 'text', 'input-collapsed': activeButton === 'microphone'}"
          ></textarea>
          <div class="input-buttons">
            <button 
              v-for="button in buttons" 
              :key="button.type"
              @click="handleButtonClick(button.type)"
              class="action-button transition-all duration-300 ease-in-out"
              :class="{
                'active-button': activeButton === button.type,
                'inactive-button': activeButton !== button.type,
                'bg-gray-400': true,
                'recording': isRecording && button.type === 'microphone',
                'order-last': activeButton === button.type,
                'order-first': activeButton !== button.type
              }"
              :disabled="isLoading || (button.type !== 'microphone' && !chatSocket)"
            >
              <Icon 
                :name="button.name" 
                :size="activeButton === button.type ? button.size : '20'" 
                :class="button.class"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { axiosDashboard } from "@/services/axios.config";

export default {
  name: "PracticeScenario",
  props: {
    scenario: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chatHistory: [],
      userMessage: "",
      isLoading: false,
      chatSocket: null,
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      chatStarted: false,
      canEndConversation: false,
      activeButton: 'text', // Valor por defecto: botón de texto
      buttons: [
        {
          name: "material-symbols:highlight-text-cursor",
          size: "32",
          class: "text-white",
          type: "text"
        },
        {
          name: "mdi:microphone",
          size: "32",
          class: "text-blue-500",
          type: "microphone"
        }
      ]
    };
  },
  methods: {
    // Método para manejar clicks en botones
    handleButtonClick(type) {
      if (type === 'microphone') {
        this.toggleRecording();
        this.setActiveButton('microphone');
      } else if (type === 'text') {
        if (this.isRecording) {
          // Si estamos grabando, detener la grabación
          this.toggleRecording();
        }
        this.setActiveButton('text');
      }
    },
    
    // Método para establecer el botón activo
    setActiveButton(type) {
      this.activeButton = type;
    },
    
    // Método para obtener el icono del botón activo
    getActiveButtonIcon() {
      const button = this.buttons.find(b => b.type === this.activeButton);
      return button ? button.name : null;
    },
    
    // Los métodos existentes...
    connectWebSocket() {
      const roomName = "lobby";
      const scenarioId = this.scenario.id;

      // Obtener la base URL correcta
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "localhost:8000" // URL de desarrollo de Django
          : "dploy-production.up.railway.app"; // URL de producción

      const wsScheme =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const wsUrl = `${wsScheme}${baseUrl}/ws/chat/${roomName}/${scenarioId}/`;


      this.chatSocket = new WebSocket(wsUrl);

      this.chatSocket.onopen = () => {
      };

      this.chatSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        this.chatHistory.push({
          role: "assistant",
          content: data.message,
        });
        
        // Actualizar el estado de canEndConversation y mostrar en consola
        if (data.can_end !== undefined) {
          this.canEndConversation = data.can_end;
        } 
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      };

      this.chatSocket.onclose = (e) => {
        setTimeout(() => {
          this.connectWebSocket();
        }, 3000);
      };

      this.chatSocket.onerror = (e) => {
        console.error("Error en WebSocket:", e); // Debug
        // Agregar más detalles del error si están disponibles
        if (e.message) console.error("Mensaje de error:", e.message);
        if (e.error) console.error("Error detallado:", e.error);
      };
    },

    async sendMessage() {
      if (!this.userMessage.trim() || this.isLoading || !this.chatSocket)
        return;

      try {
        this.isLoading = true;
        
        // Si estamos en modo micrófono, volver al modo texto después de enviar
        if (this.activeButton === 'microphone') {
          this.setActiveButton('text');
        }

        // Resto de tu código actual...
        this.chatHistory.push({
          role: "user",
          content: this.userMessage,
        });

        this.chatSocket.send(
          JSON.stringify({
            message: this.userMessage,
          })
        );

        this.userMessage = "";

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      } finally {
        this.isLoading = false;
      }
    },

    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      if (chatMessages) {
        // Verificar que chatMessages no sea null
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        console.warn("chatMessages no está disponible en scrollToBottom");
      }
    },

    async toggleRecording() {
      if (!this.isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
          this.audioChunks = [];

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, {
              type: "audio/webm",
            });
            await this.sendAudioToServer(audioBlob);
            stream.getTracks().forEach((track) => track.stop());
          };

          this.mediaRecorder.start(200);
          this.isRecording = true;
        } catch (error) {
          console.error("Error al acceder al micrófono:", error);
          alert("No se pudo acceder al micrófono");
        }
      } else {
        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
          this.mediaRecorder.stop();
        }
        this.isRecording = false;
      }
    },

    async sendAudioToServer(audioBlob) {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const response = await axiosDashboard.post(
          "/audio-transcription/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
          }
        );

        if (response.data.status === "success") {
          // Establecer el texto transcrito como mensaje del usuario
          this.userMessage = response.data.data.transcription;
          // Enviar el mensaje automáticamente
          await this.sendMessage();
        } else {
          throw new Error(response.data.message || "Error en la transcripción");
        }
      } catch (error) {
        console.error("Error al enviar el audio:", error);
        alert(
          "Error al procesar el audio: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        this.isLoading = false;
      }
    },

    startChat() {
      this.chatStarted = true;
      this.connectWebSocket();
    },

    async endConversation() {
      if (!this.chatSocket) return;
      
      try {
        this.isLoading = true;
        this.chatSocket.send(
          JSON.stringify({
            message: "end_conversation",
            type: "end_conversation"
          })
        );
      } catch (error) {
        console.error("Error al finalizar la conversación:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // Remove the automatic WebSocket connection
    // It will now connect when clicking START
  },
  beforeUnmount() {
    if (this.chatSocket) {
      this.chatSocket.close();
    }
  },
};
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
  display: flex;
  width: 100%;
  position: relative;
}

.message.user {
  justify-content: flex-end;
  padding-right: 15px;
}

.message.assistant {
  justify-content: flex-start;
  padding-left: 15px;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 70%;
}

.message.user .message-content {
  background-color: #DCF8C6;
  color: #303030;
  border-radius: 20px 20px 3px 20px;
}

.message.assistant .message-content {
  background-color: #E8E8E8;
  color: #303030;
  border-radius: 20px 20px 20px 3px;
}

.chat-input {
  
  padding: 15px;
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



button:disabled {
  background-color: #ccc;
}



button.recording {
  background-color: #f44336;
  animation: pulse 1.5s infinite;
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

.welcome-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
}

.welcome-card {
  background: rgba(255, 255, 255, 0.911);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.welcome-title {
  color: #ff6b6b;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.welcome-content {
  margin-top: 1.5rem;
}

.welcome-content h3 {
  margin-bottom: 1rem;
}

.welcome-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.start-button {
  background: #4a90e2;
  color: white;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.start-button:hover {
  background: #357abd;
}

.finish-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.finish-button:hover {
  background-color: #45a049;
}

.finish-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: center;
}

.message-control-button {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-control-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}

.message-control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Añadir estilos para los botones interactivos */
.action-button {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
}

.active-button {
  transform: translateX(10px) scale(1.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.inactive-button {
  transform: translateX(-10px) scale(0.8);
  opacity: 0.7;
  z-index: 1;
}

.input-expanded {
  width: 80%;
  transition: all 0.3s ease;
}

.input-collapsed {
  width: 60%;
  transition: all 0.3s ease;
}

.input-buttons {
  display: flex;
  gap: 5px;
  align-items: center;
}

button.recording {
  background-color: #f44336 !important;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: translateX(10px) scale(1.2);
  }
  50% {
    opacity: 0.7;
    transform: translateX(10px) scale(1.3);
  }
  100% {
    opacity: 1;
    transform: translateX(10px) scale(1.2);
  }
}

/* Estilos modificados para los botones interactivos */
.input-buttons {
  display: flex;
  justify-content: space-between;
  width: 100px; 
  position: relative;
}

.active-button {
  transform: scale(1.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.inactive-button {
  transform: scale(0.8);
  opacity: 0.7;
  z-index: 5;
}

button.recording {
  background-color: #f44336 !important;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1.2);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
