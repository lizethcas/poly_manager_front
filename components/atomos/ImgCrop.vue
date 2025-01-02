<template>
  <div class="image-cropper">
    <input type="file" @change="onFileChange" accept="image/*" />
    <div v-if="imageUrl" class="cropper-container">
      <Cropper
        ref="cropperRef"
        :src="imageUrl"
        class="cropper"
        :stencil-props="{
          aspectRatio: 1
        }"
        @change="onChange"
      />
    </div>
    
    <div v-if="imageUrl" class="controls">
      <button @click="rotate(-90)">Rotar Izquierda</button>
      <button @click="rotate(90)">Rotar Derecha</button>
      <button @click="getCropData">Guardar</button>
    </div>
    
    <!-- Mostrar la imagen recortada -->
    <img v-if="cropImg" :src="cropImg" alt="Imagen recortada" class="preview" />
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css' // Importar los estilos

export default {
  components: {
    Cropper
  },
  
  data() {
    return {
      imageUrl: '',
      cropImg: '',
      coordinates: null,
    }
  },

  methods: {
    rotate(angle) {
      if (this.$refs.cropperRef) {
        this.$refs.cropperRef.rotate(angle)
      }
    },

    onChange({ coordinates, canvas }) {
      this.coordinates = coordinates
    },

    getCropData() {
      const { canvas } = this.$refs.cropperRef.getResult()
      if (canvas) {
        this.cropImg = canvas.toDataURL('image/jpeg')
        this.$emit('crop-complete', this.cropImg) // Emitir evento con la imagen recortada
      }
    },

    onFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageUrl = e.target.result
          this.cropImg = '' // Limpiar la imagen recortada anterior
        }
        reader.readAsDataURL(file)
      }
    },
  }
}
</script>

<style scoped>
.image-cropper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.cropper-container {
  margin: 20px 0;
}

.cropper {
  height: 400px;
  background: #DDD;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

button {
  margin: 0 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.preview {
  max-width: 100%;
  margin-top: 20px;
  border: 1px solid #ddd;
}
</style>
