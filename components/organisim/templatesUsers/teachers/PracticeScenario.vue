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
        <h2 class="welcome-title">¡Vamos a conversar!</h2>
        <div class="welcome-content">
          <h3 class="text-m font-bold">🎉 {{ scenario.name }} 🎉</h3>
          <p class="text-base">
            {{ scenario.description }}
          </p>
          <button @click="startChat" class="start-button m-auto">COMENZAR</button>
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
      
      <!-- Connecting overlay -->
      <div v-if="isConnecting" class="connecting-overlay">
        <div class="connecting-spinner"></div>
        <p>Conectando...</p>
      </div>
      
      <!-- Error message -->
      <div v-if="connectionError" class="error-message">
        <p>{{ connectionError }}</p>
        <button @click="startOver" class="error-retry-button">
          <i class="fas fa-redo mr-1"></i>
          Reintentar
        </button>
      </div>
      
      <!-- Room code display -->
      <div v-if="roomCode && !connectionError" class="room-code-display">
        <p>Código de sala: <span class="room-code">{{ roomCode }}</span></p>
      </div>

      <div class="chat-container w-full">
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-content">
              {{ message.content }}
              
              <!-- Botón de traducción solo para mensajes del asistente -->
              <div v-if="message.role === 'assistant'" class="message-actions">
                <div class="action-buttons">
                  <button 
                    v-if="!message.showTranslation && !message.isTranslating" 
                    @click="translateMessage(index)" 
                    class="action-button translate-button"
                    :disabled="message.isTranslating"
                  >
                    <i class="fas fa-language mr-1"></i>
                    Traducir
                  </button>
                  <button 
                    v-if="!message.isPlaying && !message.isLoadingAudio" 
                    @click="playMessageAudio(index)" 
                    class="action-button play-button"
                    :disabled="message.isLoadingAudio"
                  >
                    <i class="fas fa-volume-up mr-1"></i>
                    Escuchar
                  </button>
                  <button 
                    v-if="message.isPlaying" 
                    @click="stopMessageAudio(index)" 
                    class="action-button stop-button"
                  >
                    <i class="fas fa-stop mr-1"></i>
                    Detener
                  </button>
                  <div v-if="message.isLoadingAudio" class="audio-loading">
                    <i class="fas fa-spinner fa-spin mr-1"></i>
                    Cargando audio...
                  </div>
                </div>
                <div v-if="message.isTranslating" class="translation-loading">
                  Traduciendo...
                </div>
                <div v-if="message.showTranslation" class="translation-container">
                  <div class="translation-text">{{ message.translation }}</div>
                  <button @click="message.showTranslation = false" class="hide-translation-button">
                    <i class="fas fa-times mr-1"></i>
                    Ocultar
                  </button>
                </div>
              </div>
              
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
                  Finalizar
                </button>
                <button 
                  class="message-control-button"
                  @click="startOver"
                  :disabled="isLoading"
                >
                  <i class="fas fa-undo mr-1"></i>
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="userMessage"
            @keyup.enter="sendMessage"
            placeholder="Mensaje..."
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
      // Si ya tenemos una conexión activa, cerrarla
      if (this.chatSocket) {
        this.chatSocket.close();
        this.chatSocket = null;
      }
      
      // Obtener el token JWT del localStorage (buscar en múltiples ubicaciones)
      let token = '';
      try {
        // Intentar obtener el token de diferentes ubicaciones comunes
        token = localStorage.getItem('access_token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('jwt') || '';
        
        // Si no se encuentra, intentar extraerlo de los datos del usuario
        if (!token) {
          const userDataString = localStorage.getItem('user');
          if (userDataString) {
            try {
              const userData = JSON.parse(userDataString);
              token = userData.token || userData.access_token || userData.jwt || '';
            } catch (e) {
              console.warn("Error al parsear datos de usuario:", e);
            }
          }
        }
        
        if (!token) {
          console.warn("No se encontró token JWT en localStorage");
          
          // En modo desarrollo, podemos continuar sin token para pruebas
          if (process.env.NODE_ENV === "development") {
            console.warn("Modo desarrollo: intentando conectar sin token");
            // No asignar token, dejarlo vacío para pruebas
          }
        }
      } catch (error) {
        console.error("Error al obtener token JWT:", error);
      }

      // Obtener la base URL correcta
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "localhost:8000" // URL de desarrollo de Django
          : "dploy-production.up.railway.app"; // URL de producción

      const wsScheme =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      
      // Construir la URL del WebSocket para la sala
      let wsUrl = '';
      
      if (this.roomCode) {
        // Conectar a una sala existente con código
        wsUrl = `${wsScheme}${baseUrl}/ws/chat/room/${this.roomCode}/`;
      } else {
        // Conectar a una nueva sala basada en escenario
        const scenarioId = this.scenario?.id;
        wsUrl = `${wsScheme}${baseUrl}/ws/chat/${scenarioId}/`;
      }
      
      // Añadir el token como parámetro de consulta solo si existe
      if (token) {
        wsUrl += `?token=${encodeURIComponent(token)}`;
      }

      console.log("Conectando a WebSocket:", wsUrl);
      this.isConnecting = true;

      this.chatSocket = new WebSocket(wsUrl);

      this.chatSocket.onopen = () => {
        console.log("Conexión WebSocket establecida");
        this.isConnecting = false;
        this.connectionError = null;
        
        // No enviar mensaje de prueba, esperar el mensaje inicial del servidor
      };

      this.chatSocket.onmessage = (e) => {
        try {
          console.log("Mensaje recibido:", e.data);
          const data = JSON.parse(e.data);
          
          // Manejar diferentes tipos de mensajes
          if (data.type === 'room_info') {
            // Información de la sala
            console.log("Información de sala:", data);
            if (data.room_code) {
              this.roomCode = data.room_code;
            }
            
            // No añadir este mensaje al historial de chat
            return;
          } else if (data.is_test) {
            // Mensaje de prueba
            console.log("Mensaje de prueba:", data.message);
            // No añadir este mensaje al historial de chat
            return;
          } else if (data.error) {
            // Mensaje de error
            console.error("Error del servidor:", data.message);
            this.connectionError = data.message;
            // No añadir este mensaje al historial de chat
            return;
          }
          
          // Añadir mensaje al historial de chat
          this.$nextTick(() => {
            this.chatHistory.push(this.createMessageObject(data.role || "assistant", data.message));
          });
          
          // Actualizar el estado de canEndConversation
          if (data.can_end !== undefined) {
            this.$nextTick(() => {
              this.canEndConversation = data.can_end;
            });
            console.log("Se puede finalizar la conversación:", data.can_end);
          } 
          
          // Si es un mensaje final, podemos hacer algo especial
          if (data.is_final) {
            console.log("Conversación finalizada por el servidor");
            // Aquí podrías mostrar un mensaje o redirigir al usuario
          }
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } catch (error) {
          console.error("Error al procesar mensaje recibido:", error);
          console.error("Datos recibidos:", e.data);
        }
      };

      this.chatSocket.onclose = (e) => {
        console.log("Conexión WebSocket cerrada. Código:", e.code, "Razón:", e.reason);
        this.isConnecting = false;
        
        // Solo reconectar si no fue un cierre normal y no estamos desmontando el componente
        if (e.code !== 1000 && this.chatStarted) {
          console.log("Intentando reconectar en 3 segundos...");
          setTimeout(() => {
            this.connectWebSocket();
          }, 3000);
        }
      };

      this.chatSocket.onerror = (e) => {
        console.error("Error en WebSocket:", e);
        this.isConnecting = false;
        this.connectionError = "Error en la conexión WebSocket";
        
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

    startOver() {
      // Cerrar la conexión WebSocket actual si existe
      if (this.chatSocket) {
        this.chatSocket.close();
        this.chatSocket = null;
      }
      
      // Limpiar el historial de chat
      this.chatHistory = [];
      
      // Reiniciar el estado
      this.chatStarted = false;
      this.canEndConversation = false;
      this.isLoading = false;
      this.userMessage = "";
      this.roomCode = null;
      this.connectionError = null;
      
      // Mostrar la pantalla de bienvenida
      console.log("Conversación reiniciada");
    },

    async translateMessage(index) {
      const message = this.chatHistory[index];
      if (message.role === 'assistant') {
        // Marcar como traduciendo
        this.chatHistory[index].isTranslating = true;
        await this.translateMessageToServer(message.content, index);
      }
    },

    async translateMessageToServer(text, index) {
      try {
        const response = await axiosDashboard.post(
          "/translate-message/",
          {
            message: text
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 30000,
          }
        );

        console.log("Respuesta de traducción:", response.data);

        if (response.data.status === "success") {
          // Actualizar propiedades directamente
          this.chatHistory[index].translation = response.data.translation;
          this.chatHistory[index].showTranslation = true;
          this.chatHistory[index].isTranslating = false;
        } else {
          throw new Error(response.data.message || "Error en la traducción");
        }
      } catch (error) {
        console.error("Error al traducir el mensaje:", error);
        // Marcar como no traduciendo
        this.chatHistory[index].isTranslating = false;
        alert(
          "Error al traducir el mensaje: " +
            (error.response?.data?.message || error.message)
        );
      }
    },

    createMessageObject(role, content) {
      return {
        role,
        content,
        // Propiedades para traducción
        translation: null,
        showTranslation: false,
        isTranslating: false,
        // Propiedades para audio
        audioUrl: null,
        isLoadingAudio: false,
        isPlaying: false,
        audioElement: null
      };
    },

    async playMessageAudio(index) {
      const message = this.chatHistory[index];
      
      // Si ya tenemos una URL de audio, reproducirla
      if (message.audioUrl) {
        console.log("Reproduciendo audio existente:", message.audioUrl);
        this.playAudio(index);
        return;
      }
      
      // Si no tenemos URL de audio, generarla
      try {
        // Marcar como cargando audio
        this.chatHistory[index].isLoadingAudio = true;
        
        console.log("Solicitando generación de audio para:", message.content.substring(0, 50) + "...");
        
        const response = await axiosDashboard.post(
          "/text-to-speech/",
          {
            texto: message.content,
            voz: "alloy" // Puedes permitir que el usuario elija la voz en el futuro
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 30000,
          }
        );
        
        console.log("Respuesta de text-to-speech:", response.data);
        
        if (response.data.status === "success") {
          // Guardar la URL del audio
          this.chatHistory[index].audioUrl = response.data.audio_url;
          console.log("URL de audio recibida:", response.data.audio_url);
          // Reproducir el audio
          this.playAudio(index);
        } else {
          throw new Error(response.data.message || "Error al generar el audio");
        }
      } catch (error) {
        console.error("Error al generar el audio:", error);
        console.error("Detalles del error:", error.response?.data || error.message);
        alert(
          "Error al generar el audio: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        this.chatHistory[index].isLoadingAudio = false;
      }
    },
    
    async verifyAudioExists(url) {
      try {
        // Obtener la base URL correcta
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000" // URL de desarrollo de Django
            : "https://dploy-production.up.railway.app"; // URL de producción
        
        // Construir la URL completa del audio
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        
        console.log("Verificando si existe el audio:", fullUrl);
        
        // Hacer una petición HEAD para verificar si el archivo existe
        const response = await fetch(fullUrl, { method: 'HEAD' });
        
        if (response.ok) {
          console.log("El archivo de audio existe y es accesible");
          return { exists: true, fullUrl };
        } else {
          console.error("El archivo de audio no existe o no es accesible. Código:", response.status);
          return { exists: false, fullUrl, error: `Error ${response.status}: ${response.statusText}` };
        }
      } catch (error) {
        console.error("Error al verificar el archivo de audio:", error);
        return { exists: false, error: error.message };
      }
    },

    async playAudio(index) {
      const message = this.chatHistory[index];
      
      // Detener cualquier audio que se esté reproduciendo
      this.stopAllAudio();
      
      // Verificar si el archivo de audio existe
      const { exists, fullUrl, error } = await this.verifyAudioExists(message.audioUrl);
      
      if (!exists) {
        console.error("No se puede reproducir el audio porque no existe o no es accesible:", error);
        alert("No se puede reproducir el audio porque no existe o no es accesible. Por favor, inténtalo de nuevo.");
        this.chatHistory[index].audioUrl = null; // Resetear la URL para que se genere de nuevo
        this.chatHistory[index].isPlaying = false;
        return;
      }
      
      // Crear un nuevo elemento de audio
      const audio = new Audio(fullUrl);
      
      // Guardar referencia al elemento de audio
      this.chatHistory[index].audioElement = audio;
      
      // Marcar como reproduciendo
      this.chatHistory[index].isPlaying = true;
      
      // Configurar evento para cuando termine la reproducción
      audio.onended = () => {
        this.chatHistory[index].isPlaying = false;
        this.chatHistory[index].audioElement = null;
      };
      
      // Configurar evento para manejar errores
      audio.onerror = (e) => {
        console.error("Error al reproducir el audio:", e);
        this.chatHistory[index].isPlaying = false;
        this.chatHistory[index].audioElement = null;
        alert("Error al reproducir el audio. Por favor, inténtalo de nuevo.");
      };
      
      // Reproducir el audio
      audio.play().catch(error => {
        console.error("Error al reproducir el audio:", error);
        this.chatHistory[index].isPlaying = false;
        this.chatHistory[index].audioElement = null;
        alert("Error al reproducir el audio: " + error.message);
      });
    },
    
    stopMessageAudio(index) {
      const message = this.chatHistory[index];
      
      if (message.audioElement) {
        message.audioElement.pause();
        message.audioElement = null;
      }
      
      message.isPlaying = false;
    },
    
    stopAllAudio() {
      // Detener todos los audios que se estén reproduciendo
      this.chatHistory.forEach((message, i) => {
        if (message.isPlaying) {
          this.stopMessageAudio(i);
        }
      });
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
  cursor: not-allowed;
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
