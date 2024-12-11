<template>
    <div class="space-y-6">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Imagen
            </label>
            <InputFile
                fileType="image"
                @file-selected="handleImageUpload"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la imagen
            </label>
            <textarea 
                v-model="localTaskData.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Describe la imagen..."
            ></textarea>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Pregunta
            </label>
            <input 
                type="text"
                v-model="localTaskData.question"
                class="w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Escribe la pregunta relacionada con la imagen..."
            >
        </div>

        <div class="flex justify-end gap-2">
            <button 
                @click="$emit('cancel')"
                class="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
                Cancelar
            </button>
            <button 
                @click="$emit('save')"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                :disabled="!isValid"
            >
                Guardar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InputFile from '../InputFile.vue';

const props = defineProps<{
    taskData: {
        image?: File;
        description: string;
        question: string;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const handleImageUpload = (file: File) => {
    localTaskData.value.image = file;
};

const isValid = computed(() => {
    return localTaskData.value.image &&
           localTaskData.value.description.trim() !== '' &&
           localTaskData.value.question.trim() !== '';
});
</script> 