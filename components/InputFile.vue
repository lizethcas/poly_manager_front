<template>
    <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 my-4 w-full">
            <label for="file-upload" class="min-w-[120px]">Cover:</label>
            <!-- Miniatura de la imagen -->
            <div class="w-16 h-16  rounded overflow-hidden">
                <ImgAtom v-if="previewImage" :image="previewImage" alt="Previsualización" />
            </div>
            <!-- Botón personalizado para subir archivos -->
            <UButton color="freshGreen" class="flex justify-center text-white" @click="triggerFileUpload">
                Upload
            </UButton>
        </div>
        <!-- Input file oculto -->
        <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="handleFileUpload" required/>
    </div>
</template>

<script setup>
import { ref } from "vue";
import ImgAtom from "./atomos/ImgAtom.vue";
const previewImage = ref(null); // Almacena la URL de la imagen seleccionada
const fileInput = ref(null);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
            previewImage.value = reader.result; 
        };
        reader.readAsDataURL(file); 
    } else {
        previewImage.value = null; 
        alert("Por favor, selecciona un archivo de imagen.");
    }
}

function triggerFileUpload() {
    fileInput.value.click();
}
</script>