<template>
    <div class="p-7 max-w-5xl m-auto w-full bg-white rounded-lg">
        <div class="flex justify-between">
            <h2 class="font-bold text-m">{{ title }}</h2>
            <img src="../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
                @click="closeModal">
        </div>

        <form @submit.prevent @click.stop>
            <div>
                <InputFile v-model="formData.cover" @update:modelValue="updateCoverImage" />

                <!-- Iterar sobre los labels para los campos del formulario -->
                <div v-for="(item, index) in labels" :key="'label-' + index">
                    <MoleculeBaseInput :title="item.label_name" :type="item.type"
                        :modelValue="formData[transformedKey(item.label_name)]"
                        @update:modelValue="(value) => updateFormField(transformedKey(item.label_name), value)" />

                    <!-- Mostrar elementos adicionales si es necesario -->
                    <div v-if="showExtraElements && index === 1">
                        <div class="flex gap-4">
                            <div v-for="(categoryOrLevel, index) in combinedOptions" :key="index" class="flex-1">
                                <SelectAtom :options="categoryOrLevel.options" :title="categoryOrLevel.title"
                                    v-model="formData.selectedOptions[categoryOrLevel.title]"
                                    @update:modelValue="(value) => updateSelectField(categoryOrLevel.title, value)" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Iterar sobre los puntos y mostrar los inputs dinámicamente -->
                <div v-for="(point, index) in bulletPoints" :key="index" class="flex items-center gap-4 mb-4">
                    <div class="min-w-[120px]"></div>
                    <UInput type="text" size="xl" class="w-full" v-model="bulletPoints[index]" />
                </div>

                <!-- Componente para agregar más puntos -->
                <BulletPoint @addBulletPoint="handleEmit" />
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-center gap-4 mt-6">
                <div class="min-w-[120px]"></div>
                <MoleculeButtonGroup @handleSave="handleSave" @handleCancel="closeModal" />
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import BulletPoint from './molecule/BulletPoint.vue';
import { createCourse, labels } from '~/data/cardModal';
import type { ModalProps } from '~/interfaces/modal.interface';
import SelectAtom from './molecule/SelectAtom.vue';
import { useFormData } from '~/hooks/userFormData';

// Hooks para manejar los datos del formulario
const { bulletPoints, formData, handleEmit, handleEmitSave, updateFormField, updateCoverImage } = useFormData();

// Propiedades del modal
const { title, showExtraElements } = defineProps<ModalProps>();

// Opciones para los selects (categorías y niveles)
const combinedOptions = [
    { options: createCourse.categorys, title: createCourse.label_select[0] },
    { options: createCourse.levels, title: createCourse.label_select[1] }
];

// Definición de eventos
const emits = defineEmits(["closeModal"]);

// Función para cerrar el modal
const closeModal = () => {
    emits("closeModal");
};

// Función para transformar las claves de los labels
const transformedKey = (key: string): string => {
    // Remove any colons, extra spaces, and standardize the key name
    return key
        .toLowerCase()
        .trim()
        .replace(/[:]/g, '')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '');
};

// Add updateSelectField function
const updateSelectField = (field: string, value: string) => {
    formData.value.selectedOptions[field] = value;
};
// Watch for changes in select fields and update formData directly
watch(
  () => formData.value.selectedOptions,
  (newOptions) => {
    for (const [key, value] of Object.entries(newOptions)) {
      const cleanKey = transformedKey(key);
      formData.value[cleanKey] = value;
    }
  },
  { immediate: true, deep: true }
);

// Update handleSave to include modal closing
const handleSave = () => {
    const completeFormData = handleEmitSave();
    console.log('Complete form data:', completeFormData);
    closeModal(); // Close the modal after saving
};

</script>
