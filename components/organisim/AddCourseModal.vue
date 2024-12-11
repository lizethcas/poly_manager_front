<template>
    <div class="p-7 max-w-3xl m-auto w-full bg-white rounded-lg  h-[80vh] overflow-y-auto">
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
                        @update:modelValue="(value) => updateFormField(transformedKey(item.label_name), value)" />

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
                <MoleculeActionButtons @handleSave="handleSave" @handleCancel="closeModal" />
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
import { useCourseStore } from '~/stores/courseStore';
import { useClassStore } from '~/stores/class.store';
import { ApiService } from '~/services/create.course.api';
import transformKey from '~/utils/stringTransformations'
import { useRoute } from 'vue-router';
import { ApiClassService } from '~/services/create.class.api';

import type { CourseForm } from '~/interfaces/modal.interface';



const route = useRoute();
const courseStore = useCourseStore();
const classStore = useClassStore();
const { bulletPoints, formData, handleEmit, updateFormField } = useFormData();


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
        alert('El nombre es obligatorio');
        return;
    }

    const formType = route.name === 'course-courseId' ? 'class' : 'course';


    if (formType === 'class') {
        const requestData = {
            class_name: formData.value.course_name,
            description: formData.value.description,
            course_id: route.params.courseId,
            bullet_points: JSON.stringify(Array.from(bulletPoints.value)),
            cover: formData.value.cover
        };
        
        const apiService = new ApiClassService();
        const response = await apiService.createClass(requestData);
        console.log(response);
        classStore.saveClass(formData.value as CourseForm);
    } else {
        const requestData = {
            course_name: formData.value.course_name,
            description: formData.value.description,
            category: formData.value.category || defaultCategory,
            level: formData.value.level || defaultLevel,
            bullet_points: JSON.stringify(Array.from(bulletPoints.value)),
            cover: formData.value.cover
        };

        const apiService = new ApiService();
        await apiService.createCourse(requestData);
        courseStore.setCourses();
    }


    closeModal();
};

const handleCoverImage = (imageFile: File) => {
    // Crear nuevo archivo con nombre sin espacios
    const newFileName = imageFile.name.replace(/\s+/g, '_');
    const newFile = new File([imageFile], newFileName, { type: imageFile.type });
    formData.value.cover = newFile;
};



</script>