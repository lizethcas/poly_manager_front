<template>
<div class="p-5 max-w-7xl m-auto w-full bg-white rounded-lg h-[90vh] overflow-y-auto relative z-50">
        <div class="flex justify-between">
            <h2 class="font-bold text-m">{{ title }}</h2>
            <img src="../../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
                @click="closeModal" />
        </div>

        <form @submit.prevent @click.stop>
            <div>
                <InputFile v-model="formData.cover" @file-selected="handleCoverImage" />
                <!-- Iterar sobre los labels para los campos del formulario -->
                <div v-for="(item, index) in labels" :key="'label-' + index">
                    <MoleculeInput :title="item.label_name" :type="item.type"
                        :modelValue="formData[transformedKey(item.label_name)]"
                        @update:modelValue="(value) => updateFormField(transformedKey(item.label_name), value)" size="lg" />

                    <!-- Mostrar elementos adicionales si es necesario -->
                    <div v-if="showExtraElements && index === 1">
                        <div class="flex gap-4">
                            <div v-for="(categoryOrLevel, index) in combinedOptions" :key="index" class="flex-1">
                                <SelectAtom :options="categoryOrLevel.options" :title="categoryOrLevel.title"
                                    v-model="formData[transformedKey(categoryOrLevel.title)]"
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
                <MoleculeActionButtons @handleSave="handleSave" @handleCancel="closeModal" :isActive="true" />
            </div>
        </form>
    </div>

</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import BulletPoint from '../molecule/BulletPoint.vue';
import { createCourse, labels } from '~/data/cardModal';
import type { ModalProps } from '~/interfaces/modal.interface';
import SelectAtom from '../molecule/SelectAtom.vue';

import { useFormData } from '~/hooks/userFormData';
import transformKey from '~/utils/stringTransformations'
import { useRoute } from 'vue-router';
import { useCourseMutation } from '~/composables/useCourseMutation';
import { useClassMutation } from '~/composables/useClassMutation';
import { useNotify } from '~/composables/useNotify'
const { success, error } = useNotify()

const route = useRoute();
const { bulletPoints, formData, handleEmit, updateFormField, resetForm } = useFormData();
const courseMutation = useCourseMutation();
const classMutation = useClassMutation();

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
const transformedKey = (key: string) => transformKey(key)

// Modify updateSelectField function
const updateSelectField = (field: string, value: string) => {
    const cleanKey = transformedKey(field) as keyof typeof formData.value;
    formData.value[cleanKey] = value as any;
};

// Add store initialization


// Al inicio del archivo, después de las importaciones
const defaultCategory = createCourse.categorys[0];
const defaultLevel = createCourse.levels[0];



// Update handleSave function
const handleSave = async () => {
    if (!formData.value?.course_name?.trim()) {
        error('El nombre es obligatorio');
        return;
    }

    const formType = route.name === 'course-courseId' ? 'class' : 'course';

    try {
        if (formType === 'class') {
            const requestData = {
                class_name: formData.value.course_name,
                description: formData.value.description,
                course_id: route.params.courseId,
                bullet_points: JSON.stringify(Array.from(bulletPoints.value)),
                cover: formData.value.cover
            };
            await classMutation.mutateAsync(requestData);
            success('Class created successfully');
        } else {
            const requestData = {
                course_name: formData.value.course_name,
                description: formData.value.description,
                category: formData.value.category || defaultCategory,
                level: formData.value.level || defaultLevel,
                bullet_points: JSON.stringify(Array.from(bulletPoints.value)),
                cover: formData.value.cover
            };
            await courseMutation.mutateAsync(requestData);
            success('Course created successfully');
        }
        resetForm();
        emits("closeModal");
    } catch (err) {
        error('Error creating course/class');
        console.error('Error creating course/class:', err);
    }
};

const handleCoverImage = (imageFile: File) => {
    // Crear nuevo archivo con nombre sin espacios
    const newFileName = imageFile.name.replace(/\s+/g, '_');
    const newFile = new File([imageFile], newFileName, { type: imageFile.type });
    formData.value.cover = newFile;
};



</script>