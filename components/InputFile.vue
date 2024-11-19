<template>
    <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 my-4 w-full">
            <label for="file-upload" class="min-w-[120px]">Cover:</label>
            <div class="w-16 h-16 rounded overflow-hidden">
                <ImgAtom v-if="previewImage" :image="previewImage" alt="Previsualización" />
            </div>
            <UButton color="freshGreen" class="flex justify-center text-white" @click="triggerFileUpload">
                Upload
            </UButton>
        </div>
        <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="handleFileUpload" accept="image/*" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import ImgAtom from "./atomos/ImgAtom.vue";

const previewImage = ref(null);
const fileInput = ref(null);

// Define emits
const emit = defineEmits(['update:modelValue']);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            previewImage.value = base64Image;
            // Emitir el valor al componente padre
            emit('update:modelValue', base64Image);
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.value = null;
        emit('update:modelValue', null);
        alert("Por favor, selecciona un archivo de imagen.");
    }
}

function triggerFileUpload() {
    fileInput.value.click();
}
</script>