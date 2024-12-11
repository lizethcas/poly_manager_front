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

        <div v-for="(category, categoryIndex) in localTaskData.categories" 
            :key="categoryIndex" 
            class="border p-4 rounded-lg">
            
            <div class="flex gap-2 items-center mb-4">
                <input 
                    type="text" 
                    v-model="category.name" 
                    placeholder="Nombre de la categoría"
                    class="flex-1 rounded-md border-gray-300 shadow-sm"
                >
                <button @click="removeCategory(categoryIndex)" class="text-red-500">
                    Eliminar categoría
                </button>
            </div>

            <div class="space-y-2 ml-4">
                <div v-for="(item, itemIndex) in category.items" 
                    :key="itemIndex"
                    class="flex gap-2">
                    <input 
                        type="text" 
                        v-model="item.text" 
                        placeholder="Elemento"
                        class="flex-1 rounded-md border-gray-300 shadow-sm"
                    >
                    <button @click="removeCategoryItem(categoryIndex, itemIndex)" 
                        class="text-red-500">
                        Eliminar
                    </button>
                </div>
                <button @click="addCategoryItem(categoryIndex)" class="text-blue-500">
                    + Agregar elemento
                </button>
            </div>
        </div>

        <button @click="addCategory" class="text-blue-500">
            + Agregar categoría
        </button>

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
        instructions: string;
        categories: Array<{
            name: string;
            items: Array<{
                text: string;
            }>;
        }>;
    }
}>();

const emit = defineEmits(['update:taskData', 'save', 'cancel']);

const localTaskData = computed({
    get: () => props.taskData,
    set: (value) => emit('update:taskData', value)
});

const addCategory = () => {
    localTaskData.value.categories.push({
        name: '',
        items: []
    });
};

const removeCategory = (categoryIndex: number) => {
    localTaskData.value.categories.splice(categoryIndex, 1);
};

const addCategoryItem = (categoryIndex: number) => {
    localTaskData.value.categories[categoryIndex].items.push({ text: '' });
};

const removeCategoryItem = (categoryIndex: number, itemIndex: number) => {
    localTaskData.value.categories[categoryIndex].items.splice(itemIndex, 1);
};

const isValid = computed(() => {
    return localTaskData.value.categories.length >= 2 && 
           localTaskData.value.categories.every(category => 
               category.name.trim() !== '' && 
               category.items.length > 0 && 
               category.items.every(item => item.text.trim() !== '')
           );
});
</script>