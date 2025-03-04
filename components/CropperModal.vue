<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-lg">
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
      <div class="flex justify-end mt-4">
        <button @click="saveCroppedImage" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Cropper,
  },
  props: {
    img: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const croppedImage = ref(null);

    const handleCropChange = ({ coordinates, canvas }) => {
      if (canvas) {
        croppedImage.value = canvas.toDataURL();
      }
    };

    const closeModal = () => {
      emit('close');
    };

    const saveCroppedImage = () => {
      emit('save', croppedImage.value);
      closeModal();
    };

    return {
      croppedImage,
      handleCropChange,
      closeModal,
      saveCroppedImage,
    };
  },
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>