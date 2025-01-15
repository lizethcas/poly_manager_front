<template>
  <div class="text-to-speech-container">
    <div v-if="audioUrl" class="audio-container">
      <audio 
        ref="audioPlayer" 
        :src="audioUrl" 
        class="audio-player"
        @loadedmetadata="initializeAudio"
        @ended="handleAudioEnd"
      ></audio>
      
      <div class="controls">
        <button @click="playAudio" class="play-button">
          <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
          {{ isPlaying ? 'Pausar' : 'Reproducir' }}
        </button>

        <div class="speed-controls">
          <label>Velocidad:</label>
          <select v-model="playbackRate" @change="updatePlaybackRate" class="speed-select">
            <option value="0.5">0.5x</option>
            <option value="1.0">1.0x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axios.config'

export default {
  name: 'TextToSpeech',
  data() {
    return {
      vozSeleccionada: 'alloy',
      audioUrl: null,
      error: null,
      isLoading: false,
      playbackRate: "1.0",
      isPlaying: false
    }
  },
  methods: {
    async convertirAudio(texto) {
      if (!texto) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post('text-to-speech/', {
          texto: texto,
          voz: this.vozSeleccionada
        });

        if (response.data.status === 'success') {
          const baseUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8000'
            : 'https://dploy-production.up.railway.app';
          this.audioUrl = `${baseUrl}${response.data.audio_url}`;
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.isLoading = false;
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
    },
    playAudio() {
      if (this.$refs.audioPlayer) {
        if (this.isPlaying) {
          this.$refs.audioPlayer.pause();
        } else {
          // Si el audio terminó, reiniciamos el tiempo a 0
          if (this.$refs.audioPlayer.ended) {
            this.$refs.audioPlayer.currentTime = 0;
          }
          this.$refs.audioPlayer.play();
        }
        this.isPlaying = !this.isPlaying;
      }
    },
    handleAudioEnd() {
      this.isPlaying = false;
    }
  },
  props: {
    initialText: {
      type: String,
      default: ''
    }
  },
  watch: {
    initialText: {
      immediate: true,
      handler(newText) {
        if (newText) {
          this.convertirAudio(newText);
        }
      }
    }
  }
}
</script>

<style scoped>
.text-to-speech-container {
  margin: 5px 0;
}

.audio-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
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

.speed-controls {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.speed-select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.play-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.play-button:hover {
  background-color: #45a049;
}

.play-button i {
  font-size: 14px;
}
</style>
