<template>
  <div>
    <h1>IaChatGPT</h1>
    <img 
      v-if="previewImage" 
      :src="previewImage" 
      alt="Generated Image" 
      class="max-w-full h-auto rounded-lg shadow-lg"
    />
    <IaGeneratorModal
      v-model="showModal"
      @image-generated="handleImageGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
const previewImage = ref<string | null>(null);

const handleImageGenerated = (base64Image: string) => {
  previewImage.value = base64Image;
  console.log('Image received in IaChatGPT:', base64Image);
};

</script>
