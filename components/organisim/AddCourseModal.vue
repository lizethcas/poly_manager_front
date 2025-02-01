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
        <!-- Iterar sobre los labels para los campos del formulario -->
        <div v-for="(item, index) in labels" :key="'label-' + index">


          <MoleculeInput
            :title="item.label_name"
            :type="item.type"
            :modelValue="formData[item.field_name as keyof typeof formData] || props.initialData?.[item.field_name]"
            @update:modelValue="
              (value) => updateFormField(item.field_name, value)
            "
            size="lg"
          />

          <!-- Mostrar elementos adicionales si es necesario -->
          <div v-if="showExtraElements && index === 1">
            <div class="flex gap-4">
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
      <div class="flex justify-center gap-4 mt-6">
        <MoleculeActionButtons
          @handleSave="handleSave"
          @handleCancel="closeModal"
          @handleDelete="$emit('handleDelete')"
          :isActive="true"
          :deleteAction="props.deleteAction"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";
import BulletPoint from "../molecule/BulletPoint.vue";

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

// Remove the handleSave function and replace it with this simpler version
const handleSave = () => {
  if (!formData.value.cover && props.actionType !== "edit") {
    error("La imagen es obligatoria");
    return;
  }

  if (!formData.value?.course_name?.trim() && props.actionType !== "edit") {
    error("El nombre es obligatorio");
    return;
  }

  emits("handleSave", {
    formData: formData.value,
    bulletPoints: Array.from(bulletPoints.value),
  });
};

// Añade esta referencia para manejar la URL de previsualización
const previewUrl = ref<string | null>(null);

// Modifica la función handleCoverImage
const handleCoverImage = (imageFile: File) => {
  // Crear nuevo archivo con nombre sin espacios
  const newFileName = imageFile.name.replace(/\s+/g, "_");
  const newFile = new File([imageFile], newFileName, { type: imageFile.type });
  formData.value.cover = newFile;
  // Actualizar la URL de previsualización
  previewUrl.value = URL.createObjectURL(newFile);
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

    // Inicializar bulletPoints si existen en initialData
    if (
      props.initialData.bullet_points &&
      props.initialData.bullet_points.length > 0
    ) {
      bulletPoints.value = [...props.initialData.bullet_points];
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
  console.log("initialData", props.initialData);
});
</script>
