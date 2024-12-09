<template>
    <div v-if="isOpen"
        class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start pt-6">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-4 border-b-[1px] pb-2">
                <div class="flex items-center gap-2">
                    <Icon :name="icon" size="30" class="text-primary-color" />
                    <h2 class="text-m font-bold text-primary-color ">{{ title }}</h2>
                </div>
                <img src="../../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
                    @click="$emit('close')" />
            </div>

            <!-- Common Fields -->
            <div class="space-y-4 mb-6">
                <MoleculeInputFile :title="'Title'" type="text" class="text-md" v-model="formData.title" />
                <MoleculeInputFile :title="'Instructions'" type="text_area" class="text-md"
                    v-model="formData.instructions" />


            </div>

            <!-- Slot for specific content -->
            <slot></slot>

            <!-- Submit Button -->

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Maneja los datos de los inputs
const formData = ref({
    title: '',
    instructions: '',
});

// Observa los cambios en formData y registra en consola
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
}, { deep: true });

const emit = defineEmits(['update:modelValue', 'close']);

defineProps(['isOpen', 'title', 'modelValue', 'icon', 'type']);


</script>