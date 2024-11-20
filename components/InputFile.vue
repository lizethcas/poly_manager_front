<template>
    <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 my-4 w-full">
            <!-- Etiqueta y previsualización -->
            <label for="file-upload" class="min-w-[120px]">Cover:</label>
            <div class="w-16 h-16 rounded overflow-hidden">
                <ImgAtom v-if="previewUrl" :image="previewUrl" alt="Preview" />
            </div>

            <!-- Botón para subir archivo -->
            <UButton color="freshGreen" class="flex justify-center text-white" @click="triggerFileUpload">
                Upload
            </UButton>
        </div>

        <!-- Input oculto -->
        <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="handleChange" accept="image/*" />
    </div>
</template>

<script setup>
import ImgAtom from "./atomos/ImgAtom.vue";
import { ref, defineProps, defineEmits } from "vue";

// Props y eventos
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'file-selected']);

// Referencia al input
const fileInput = ref(null);
const previewUrl = ref(null); // Almacenar la URL de previsualización

// Disparar el input al hacer clic en el botón
const triggerFileUpload = () => {
    fileInput.value.click();
};

// Manejar cambios en el archivo seleccionado
const handleChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        // Crear vista previa
        previewUrl.value = URL.createObjectURL(file);

        // Emitir eventos
        emit('update:modelValue', previewUrl.value); // Actualizar la previsualización
        emit('file-selected', file); // Notificar al padre sobre el archivo real
    }
};
</script>
