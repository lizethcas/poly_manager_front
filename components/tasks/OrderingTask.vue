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

        <div class="space-y-2">
            <div v-for="(item, index) in localTaskData.items" :key="index" 
                class="flex gap-2 items-center">
                <input 
                    type="text" 
                    v-model="item.description" 
                    placeholder="Elemento" 
                    class="flex-1 rounded-md border-gray-300 shadow-sm"
                >
                <input 
                    type="number" 
                    v-model="item.order" 
                    min="1"
                    :max="localTaskData.items.length"
                    class="w-20 rounded-md border-gray-300 shadow-sm"
                >
                <button @click="removeOrderingItem(index)" class="text-red-500">
                    Eliminar
                </button>
            </div>
            <button @click="addOrderingItem" class="text-blue-500">
                + Agregar elemento
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
import { computed } from 'vue';

const props = defineProps<{
    taskData: {
        items: Array<{
            id: number;
            description: string;
            order: number;
        }>;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const addOrderingItem = () => {
    const newOrder = localTaskData.value.items.length + 1;
    localTaskData.value.items.push({
        id: newOrder,
        description: '',
        order: newOrder
    });
};

const removeOrderingItem = (index: number) => {
    localTaskData.value.items.splice(index, 1);
    localTaskData.value.items.forEach((item, idx) => {
        item.order = idx + 1;
    });
};

const isValid = computed(() => {
    return localTaskData.value.items.length >= 2 && 
           localTaskData.value.items.every(item => item.description.trim() !== '');
});
</script> 