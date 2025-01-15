<template>
    <div class="text-to-speech-container">
      <h2 class="title">Convertir Texto a Voz</h2>
      
      <div class="input-container">
        <textarea 
          v-model="texto" 
          class="text-input"
          placeholder="Ingresa el texto que deseas convertir a voz..."
          rows="4"
        ></textarea>
        
        <select v-model="vozSeleccionada" class="voice-select">
          <option v-for="voz in voces" :key="voz.id" :value="voz.id">
            {{ voz.nombre }}
          </option>
        </select>
        
        <button 
          @click="convertirAudio" 
          class="convert-button"
          :disabled="!texto || isLoading"
        >
          {{ isLoading ? 'Generando...' : 'Convertir a Audio' }}
        </button>
      </div>
  
      <div v-if="audioUrl" class="audio-container">
        <audio 
          ref="audioPlayer" 
          :src="audioUrl" 
          class="audio-player"
          @loadedmetadata="initializeAudio"
        ></audio>
        
        <div class="speed-controls">
          <label>Velocidad:</label>
          <select v-model="playbackRate" @change="updatePlaybackRate" class="speed-select">
            <option value="0.5">0.5x</option>
            <option value="1.0">1.0x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>
  
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/services/axios.config'
  
  export default {
    name: 'TextToSpeech',
    data() {
      return {
        texto: '',
        vozSeleccionada: 'alloy',
        voces: [
          { id: 'alloy', nombre: 'Alloy' },
          { id: 'echo', nombre: 'Echo' },
          { id: 'fable', nombre: 'Fable' },
          { id: 'onyx', nombre: 'Onyx' },
          { id: 'nova', nombre: 'Nova' },
          { id: 'shimmer', nombre: 'Shimmer' }
        ],
        audioUrl: null,
        error: null,
        isLoading: false,
        playbackRate: "1.0",
      }
    },
    methods: {
      async convertirAudio() {
        this.isLoading = true
        this.error = null
        this.audioUrl = null
  
        try {
          const response = await axiosInstance.post('text-to-speech/', {
            texto: this.texto,
            voz: this.vozSeleccionada
          })
  
          if (response.data.status === 'success') {
            const baseUrl = process.env.NODE_ENV === 'development' 
              ? 'http://localhost:8000'
              : 'https://dploy-production.up.railway.app';
            this.audioUrl = `${baseUrl}${response.data.audio_url}`;
            
            this.$nextTick(() => {
              if (this.$refs.audioPlayer) {
                this.$refs.audioPlayer.play();
              }
            });
          } else {
            this.error = response.data.message || 'Error al generar el audio'
          }
        } catch (error) {
          this.error = error.response?.data?.message || 'Error al comunicarse con el servidor'
        } finally {
          this.isLoading = false
        }
      },
      initializeAudio() {
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.playbackRate = parseFloat(this.playbackRate);
        }
      },
      updatePlaybackRate() {
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.playbackRate = parseFloat(this.playbackRate);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .text-to-speech-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .title {
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .text-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }
  
  .voice-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .convert-button {
    padding: 12px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .convert-button:hover {
    background-color: #45a049;
  }
  
  .convert-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .audio-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .audio-player {
    width: 100%;
    margin-top: 10px;
  }
  
  .download-link {
    color: #2196F3;
    text-decoration: none;
  }
  
  .download-link:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: #f44336;
    margin-top: 10px;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
  }
  </style>
  