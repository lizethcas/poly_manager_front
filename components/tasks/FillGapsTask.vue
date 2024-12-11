<template>
    <div class="space-y-6">
        <div>
            <label class="block text-sm font-medium text-gray-700">Instrucciones</label>
            <textarea 
                v-model="localTaskData.instructions" 
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">
                Texto con espacios (usa [palabra] para marcar los espacios)
            </label>
            <textarea 
                v-model="localTaskData.text_with_gaps" 
                rows="4"
                placeholder="Ejemplo: El [gato] saltó sobre el [perro]."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
        </div>

        <div v-if="keywords.length > 0">
            <label class="block text-sm font-medium text-gray-700">Palabras clave detectadas:</label>
            <div class="mt-1 flex flex-wrap gap-2">
                <span 
                    v-for="keyword in keywords" 
                    :key="keyword"
                    class="px-2 py-1 bg-blue-100 rounded"
                >
                    {{ keyword }}
                </span>
            </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
            <button @click="$emit('cancel')" class="px-4 py-2 border rounded">
                Cancelar
            </button>
            <button 
                @click="$emit('save')" 
                class="px-4 py-2 bg-blue-500 text-white rounded"
                :disabled="!isValid"
            >
                Guardar
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    taskData: {
        text_with_gaps: string;
        instructions: string;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const keywords = computed(() => {
    const matches = localTaskData.value.text_with_gaps.match(/\[(.*?)\]/g) || [];
    return matches.map(match => match.replace(/[\[\]]/g, ''));
});

const isValid = computed(() => {
    return keywords.value.length > 0;
});
</script> 