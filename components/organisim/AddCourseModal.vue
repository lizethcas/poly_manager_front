<template>
  <div
    class="p-5 max-w-7xl m-auto w-full bg-white rounded-lg h-[90vh] overflow-y-auto relative z-50"
  >
    <div class="flex justify-between">
      <h2 class="font-bold text-m">{{ title }}</h2>
      <img
        src="../../assets/images/close.webp"
        alt="close create course"
        class="w-5 h-5 cursor-pointer"
        @click="closeModal"
      />
    </div>

    <form @submit.prevent @click.stop>
      <div>
        <div class="flex items-center gap-2 py-4 text-sm justify-between">
          <InputFile
            v-model="formData.cover"
            :previewUrl="previewUrl || props.initialData?.cover"
            @file-selected="handleCoverImage"
          />
          <div class="flex items-center gap-2 py-4 text-sm">
            <p>Publish</p>
            <AtomosToggle 
              v-model="formData.publish" 
              :modelValue="formData.publish || props.initialData?.publish || false"
            />
          </div>
        </div>

        <!-- Añadir el icono para abrir el modal de recorte -->
        <div v-if="previewUrl" class="my-4 flex items-center">
          
          <button @click="openCropperModal" class="text-gray-500 hover:text-gray-700">
            <!-- <i class="i-heroicons-adjustments-20-solid"></i> -->
            Abrir 
          </button>
        </div>

        <!-- Iterar sobre los labels para los campos del formulario -->
        <div v-for="(item, index) in labels" :key="'label-' + index">
          <MoleculeInput
            :title="item.getLabelName ? item.getLabelName(title) : item.label_name"
            :type="item.type"
            :modelValue="formData[item.field_name as keyof typeof formData] || props.initialData?.[item.field_name]"
            @update:modelValue="
              (value) => updateFormField(item.field_name, value)
            "
            size="lg"
          />

          <!-- Mostrar elementos adicionales si es necesario -->
          <div v-if="showExtraElements && index === 1">
            <div class="flex flex-col md:flex-row md:gap-3">
              <div
                v-for="(categoryOrLevel, index) in combinedOptions"
                :key="index"
                class="flex-1"
              >
                <SelectAtom
                  :options="categoryOrLevel.options"
                  :title="categoryOrLevel.title"
                  v-model="formData[transformedKey(categoryOrLevel.title)]"
                  @update:modelValue="
                    (value) => updateSelectField(categoryOrLevel.title, value)
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Iterar sobre los puntos y mostrar los inputs dinámicamente -->
        <div
          v-for="(point, index) in bulletPoints"
          :key="index"
          class="items-center gap-4 mb-4"
        >
          <UInput
            type="text"
            size="md"
            class="w-full"
            v-model="bulletPoints[index]"
          />
        </div>

        <!-- Componente para agregar más puntos -->
        <BulletPoint @addBulletPoint="handleEmit" />
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-center mt-3">
        <MoleculeActionButtons
          @handleSave="handleSave"
          @handleCancel="closeModal"
          @handleDelete="$emit('handleDelete')"
          :isActive="true"
          :deleteAction="props.deleteAction"
        />
      </div>
    </form>

    <!-- Modal de recorte de imagen -->
    <CropperModal
      v-if="previewUrl"
      :img="previewUrl"
      :isOpen="isCropperModalOpen"
      @close="closeCropperModal"
      @save="updateCroppedImage"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";
import BulletPoint from "../molecule/BulletPoint.vue";
import 'vue-advanced-cropper/dist/style.css';
import CropperModal from '../CropperModal.vue';
import InputFile from '../InputFile.vue';

import { createCourse, labels } from "~/data/cardModal";
import type { ModalProps } from "~/interfaces/modal.interface";
import SelectAtom from "../molecule/SelectAtom.vue";

import { useFormData } from "~/hooks/userFormData";
import transformKey from "~/utils/stringTransformations";
import { useNotify } from "~/composables/useNotify";
const { error } = useNotify();

const { bulletPoints, formData, handleEmit, updateFormField, resetForm } =
  useFormData();

// Propiedades del modal
const props = defineProps<ModalProps>();

// Añadir referencia para el recorte de la imagen
const croppedImage = ref<string | null>(null);

// Estado para controlar la apertura del modal de recorte
const isCropperModalOpen = ref(false);

/* const routeCourseId = route.params.courseId; */
// Opciones para los selects (categorías y niveles)
const combinedOptions = [
  { options: createCourse.categorys, title: createCourse.label_select[0] },
  { options: createCourse.levels, title: createCourse.label_select[1] },
];

// Modify the emits definition
const emits = defineEmits(["closeModal", "handleSave", "handleDelete"]);

// Función para cerrar el modal
const closeModal = () => {
  emits("closeModal");
};

// Función para transformar las claves de los labels
const transformedKey = (key: string) => transformKey(key);

// Modify updateSelectField function
const updateSelectField = (field: string, value: string) => {
  const cleanKey = transformedKey(field) as keyof typeof formData.value;
  formData.value[cleanKey] = value as any;
};

// Modify handleSave to ensure bullet points are properly formatted
const handleSave = () => {
  if (!formData.value.cover && props.actionType !== "edit") {
    error("La imagen es obligatoria");
    return;
  }

  if (!formData.value?.name?.trim() && props.actionType !== "edit") {
    error("El nombre es obligatorio");
    return;
  }

  // Ensure bullet points are in the correct format
  const cleanBulletPoints = bulletPoints.value.filter(point => point && point.trim());

  emits("handleSave", {
    formData: formData.value,
    bulletPoints: cleanBulletPoints,
  });
};

// Añade esta referencia para manejar la URL de previsualización
const previewUrl = ref<string | null>(null);

// Modifica la función handleCoverImage
const handleCoverImage = ({ file, preview }) => {
  if (!(file instanceof Blob || file instanceof File)) {
    console.error("El archivo seleccionado no es válido:", file);
    return;
  }

  // Si ya hay una URL creada, liberarla antes de asignar una nueva
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  const newFileName = file.name.replace(/\s+/g, "_");
  const newFile = new File([file], newFileName, { type: file.type });

  formData.value.cover = newFile;
  previewUrl.value = URL.createObjectURL(newFile);
};

// Función para convertir una URL de datos en un objeto File
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Modifica la función initializeFormData para manejar la URL inicial
const initializeFormData = () => {
  if (props.initialData) {
    type FormDataKey = keyof typeof formData.value;
    Object.entries(props.initialData).forEach(([key, value]) => {
      if (key in formData.value) {
        updateFormField(key as FormDataKey, value);
      }
    });

    // Modified bullet_points initialization
    if (props.initialData.bullet_points) {
      try {
        // Handle case where bullet_points might be a string
        const points = typeof props.initialData.bullet_points === 'string' 
          ? JSON.parse(props.initialData.bullet_points)
          : props.initialData.bullet_points;
        
        bulletPoints.value = Array.isArray(points) ? points : [];
      } catch (e) {
        console.error('Error parsing bullet points:', e);
        bulletPoints.value = [];
      }
    }

    // Si hay una cover inicial, establecer la URL de previsualización
    if (props.initialData.cover) {
      previewUrl.value = props.initialData.cover;
    }
  }
};

// Add watch or onMounted to initialize the data
onMounted(() => {
  initializeFormData();
});


// Función para abrir el modal de recorte
const openCropperModal = () => {
  isCropperModalOpen.value = true;
};

// Función para cerrar el modal de recorte
const closeCropperModal = () => {
  isCropperModalOpen.value = false;
};

// Función para actualizar la imagen recortada
const updateCroppedImage = (croppedImg) => {
  const file = dataURLtoFile(croppedImg, 'cropped_image.png');
  previewUrl.value = URL.createObjectURL(file);
  formData.value.cover = file;
};
</script>