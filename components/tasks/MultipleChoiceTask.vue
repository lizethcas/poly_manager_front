<template>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700">Instrucciones</label>
            <textarea 
                v-model="localTaskData.instructions" 
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700">Pregunta</label>
            <input 
                type="text" 
                v-model="localTaskData.question" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
        </div>
        
        <div class="space-y-2">
            <div v-for="(answer, index) in localTaskData.answers" :key="index" 
                class="flex gap-2">
                <input 
                    type="text" 
                    v-model="answer.text" 
                    placeholder="Respuesta" 
                    class="flex-1 rounded-md border-gray-300 shadow-sm"
                >
                <label class="flex items-center gap-2">
                    <input type="checkbox" v-model="answer.is_correct">
                    Correcta
                </label>
                <button @click="removeAnswer(index)" class="text-red-500">
                    Eliminar
                </button>
            </div>
            <button @click="addAnswer" class="text-blue-500">
                + Agregar respuesta
            </button>
        </div>

        <div class="mt-4 flex justify-end gap-2">
            <button @click="$emit('cancel')" class="px-4 py-2 border rounded">
                Cancelar
            </button>
            <button @click="$emit('save')" class="px-4 py-2 bg-blue-500 text-white rounded">
                Guardar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    taskData: {
        instructions: string;
        question: string;
        answers: Array<{
            text: string;
            is_correct: boolean;
        }>;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const addAnswer = () => {
    localTaskData.value.answers.push({ text: '', is_correct: false });
};

const removeAnswer = (index: number) => {
    localTaskData.value.answers.splice(index, 1);
};
</script> 