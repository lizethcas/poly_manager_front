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

        <div v-for="(question, index) in localTaskData.questions" :key="index" 
            class="flex gap-2 items-start">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Afirmación</label>
                <input 
                    type="text" 
                    v-model="question.statement" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700">Estado</label>
                <select 
                    v-model="question.state" 
                    class="mt-1 block rounded-md border-gray-300 shadow-sm"
                >
                    <option value="1">Verdadero</option>
                    <option value="0">Falso</option>
                </select>
            </div>

            <button @click="removeQuestion(index)" class="mt-6 text-red-500">
                Eliminar
            </button>
        </div>

        <button @click="addQuestion" class="text-blue-500">
            + Agregar afirmación
        </button>

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
import { computed } from 'vue';

const props = defineProps<{
    taskData: {
        instructions: string;
        questions: Array<{
            statement: string;
            state: string;
        }>;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const addQuestion = () => {
    localTaskData.value.questions.push({
        statement: '',
        state: '1'
    });
};

const removeQuestion = (index: number) => {
    localTaskData.value.questions.splice(index, 1);
};
</script> 