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
      <div class="welcome-card">
        <h2 class="welcome-title">Let's talk!</h2>
        <div class="welcome-content">
          <h3>🎉 Welcome to the Party! 🎉</h3>
          <p>
            Imagina que estás en una fiesta animada. Ves a alguien a quien
            quieres conocer. Comienza por saludar, presentarte y preguntarle su
            nombre. Luego revisaré tu gramática y pronunciación.
          </p>
          <button @click="startChat" class="start-button">START</button>
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
      <div class="scenario-info">
        <h1>{{ scenario.name }}</h1>
        <p class="location">{{ scenario.location }}</p>
        <p class="description">{{ scenario.description }}</p>
      </div>

      <div class="chat-container">
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-content">
              {{ message.content }}
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
              {{ isLoading ? "Enviando..." : "Enviar" }}
            </button>
            <button
              @click="toggleRecording"
              :class="{ recording: isRecording }"
              :disabled="isLoading"
              type="button"
            >
              <i class="fas fa-microphone"></i>
              {{ isRecording ? "Detener" : "Grabar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importar la configuración de URLs
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
    };
  },
  methods: {
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

      console.log("Intentando conectar WebSocket a:", wsUrl); // Debug

      this.chatSocket = new WebSocket(wsUrl);

      this.chatSocket.onopen = () => {
        console.log("WebSocket conectado exitosamente"); // Debug
      };

      this.chatSocket.onmessage = (e) => {
        console.log("Mensaje recibido:", e.data); // Debug
        const data = JSON.parse(e.data);
        this.chatHistory.push({
          role: "assistant",
          content: data.message,
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      };

      this.chatSocket.onclose = (e) => {
        console.log("WebSocket cerrado. Código:", e.code, "Razón:", e.reason); // Debug detallado
        setTimeout(() => {
          console.log("Intentando reconexión..."); // Debug
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

        // Agregar mensaje del usuario al historial
        this.chatHistory.push({
          role: "user",
          content: this.userMessage,
        });

        // Enviar mensaje a través del WebSocket
        this.chatSocket.send(
          JSON.stringify({
            message: this.userMessage,
          })
        );

        // Limpiar el mensaje
        this.userMessage = "";

        // Scroll al último mensaje
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
  max-width: 80%;
  position: relative;
}

.message.user {
  margin-left: auto;
}

.message.assistant {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 15px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.message.user .message-content {
  background-color: #dcf8c6;
  color: #303030;
  border-radius: 15px 0px 15px 15px;
}

.message.user .message-content::after {
  content: "";
  position: absolute;
  right: -10px;
  top: 0;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: #dcf8c6;
  border-right: 0;
  border-top: 0;
}

.message.assistant .message-content {
  background-color: white;
  color: #303030;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 0px 15px 15px 15px;
}

.message.assistant .message-content::after {
  content: "";
  position: absolute;
  left: -10px;
  top: 0;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: white;
  border-left: 0;
  border-top: 0;
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
  background: white;
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
</style>
