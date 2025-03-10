<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-lg max-h-full overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Ajustar Imagen</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="i-heroicons-x-20-solid"></i>
        </button>
      </div>
      <Cropper
        :src="img"
        :stencil-props="{ aspectRatio: 1 }"
        @change="handleCropChange"
      />
      <div class="flex justify-end mt-4 space-x-2">
        <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Cancelar
        </button>
        <button @click="saveCroppedImage" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

interface Props {
  img: string
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [croppedImage: string]
}>()

const croppedImage = ref<string | null>(null)

const handleCropChange = ({ coordinates, canvas }: { coordinates: any, canvas: HTMLCanvasElement }) => {
  if (canvas) {
    croppedImage.value = canvas.toDataURL()
  }
}

const closeModal = () => {
  emit('close')
}

const saveCroppedImage = () => {
  if (croppedImage.value) {
    emit('save', croppedImage.value)
    closeModal()
  }
}
</script>