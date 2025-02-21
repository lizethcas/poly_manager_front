<template>
  <div class="my-4">
    <h2 class="text-md font-bold text-gray-700">Images</h2>

    <!-- Gallery items list -->
    <div class="space-y-4">
      <div
        v-for="(item, index) in formData.content_details"
        :key="index"
        class="flex gap-4"
      >
        <!-- Image preview -->
        <div class="w-24 h-24" v-if="item.preview">
          <img
            :src="item.preview"
            class="w-full h-full object-cover rounded-lg"
            alt="Preview"
          />
        </div>
        <!-- Form fields -->
        <div class="flex-1 flex flex-col gap-2">
          <MoleculeInput
            title="Title"
            type="text"
            class="text-md"
            v-model="item.title"
          />
          <MoleculeInput
            title="Description"
            type="text_area"
            :size="'md'"
            v-model="item.description"
            class="text-md"
          />
        </div>
        <button @click="removeImage(index)" class="text-red-500">
          Eliminar
        </button>
      </div>
    </div>

    <!-- Upload options -->
    <div class="flex mt-4 items-end gap-2">
      <InputFile
        fileType="image"
        icon="true"
        @file-selected="addNewImage"
        :showPreview="false"
      />

      <!-- AI Image Generator Button -->

      <IconMolecule
        :name="IconType.imgGen"
        :size="30"
        @click="showImageGenerator = true"
        color="text-purple-500 hover:text-purple-600"
        class="mr-2 shimmer-effect transition-all duration-300"
      />
    </div>

    <!-- AI Image Generator Modal -->
    <IaGeneratorModal
      v-model="showImageGenerator"
      @image-generated="handleGeneratedImage"
    />

    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle v-model="formData.stats" />
    </div>

    <MoleculeActionButtons
      @handleSave="handleSave"
      @handleCancel="handleCancel"
      :isActive="isFormValid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { useRoute } from "vue-router";
import { useClassContentMutation } from "~/composables/useClassContentMutation";
import { createBaseTaskData } from "~/interfaces/task.interface";
import ImgGenerator from "../IA/ImgGenerator.vue";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
import IaGeneratorModal from "../IA/IaGeneratorModal.vue";

const route = useRoute();
const taskStore = useTaskStore();
const mutation = useClassContentMutation();
const taskInstructions = computed(() => taskStore.getTask("instructions"));
const taskImgGen = computed(() => taskStore.getTask("img_gen"));

interface Image {
  title: string;
  description: string;
  image: File | string; // Aquí ahora es File en vez de string
  preview: string;
  showPreview: boolean;
}

const formData = ref({
  ...createBaseTaskData(route.params.classId, "image"),
  content_details: [] as Array<Image>,
});

watch(taskImgGen, (newValue) => {
  console.log('Nueva imagen recibida del generador:', newValue);
  formData.value.content_details.push({
    title: "",
    description: "",
    image: newValue,
    preview: newValue,
    showPreview: true,
  });
});

watch(
  taskInstructions,
  (newValue) => {
    formData.value.tittle = newValue.title || "";
    formData.value.instructions = newValue.instructions || "";
  },
  { deep: true }
);

const isFormValid = computed(() => {
  const images = formData.value.content_details;
  return (
    images.length > 0 && images.every((img) => img.title && img.description)
  );
});

const handleSave = async () => {
  try {
    const formDataObj = new FormData();
    formDataObj.append('class_id', route.params.classId as string);
    formDataObj.append('content_type', 'image');
    formDataObj.append('tittle', formData.value.tittle);
    formDataObj.append('stats', formData.value.stats.toString());

    // Preparar los detalles de las imágenes
    const imagesDetails = formData.value.content_details.map((item, index) => ({
      title: item.title,
      description: item.description
    }));

    // Agregar content_details como string JSON
    formDataObj.append('content_details', JSON.stringify({ images: imagesDetails }));

    // Agregar cada imagen como un archivo separado
    for (const item of formData.value.content_details) {
      try {
        if (item.image instanceof File) {
          console.log('Procesando imagen File:', item.image.name);
          formDataObj.append('images[]', item.image);
        } else if (typeof item.image === 'string') {
          console.log('Procesando imagen URL:', item.image);
          // Enviar la URL directamente al backend
          formDataObj.append('image_urls[]', item.image);
        }
      } catch (error) {
        console.error('Error detallado al procesar imagen:', {
          tipo: item.image instanceof File ? 'File' : 'URL',
          url: typeof item.image === 'string' ? item.image : 'N/A',
          error: error
        });
        throw new Error(`Error al procesar imagen: ${error.message}`);
      }
    }

    console.log('FormData completo:');
    for (let pair of formDataObj.entries()) {
      console.log(pair[0], typeof pair[1], pair[1]);
    }

    const response = await mutation.create.mutateAsync(formDataObj);
    console.log('Respuesta del servidor:', response);

    if (response.status === "success") {
      taskStore.addTask("modal", { modal: false });
      formData.value.content_details = [];
      formData.value.stats = false;
    } else {
      throw new Error(response.message || "Error al guardar las imágenes");
    }
  } catch (error: any) {
    console.error('Error completo:', error);
    alert(error.message || "Error al guardar las imágenes");
  }
};

// Método para agregar nueva imagen
const addNewImage = async (file: File) => {
  if (!(file instanceof File)) {
    console.error("No es un objeto File válido:", file);
    return;
  }

  // Guardar el archivo como objeto 'File' directamente y generar la vista previa
  const preview = URL.createObjectURL(file);
  formData.value.content_details.push({
    title: "",
    description: "",
    image: file,  // Guardamos el archivo directamente
    preview: preview,
  });
};

const removeImage = (index: number) => {
  formData.value.content_details.splice(index, 1);
};

const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
  formData.value.content_details = [];
  formData.value.stats = false;
};

// Agregar nuevos refs
const showImageGenerator = ref(false);

// Agregar función para convertir URL a File
const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw error;
  }
};

// Modificar el método handleGeneratedImage
const handleGeneratedImage = async (imageUrl: string) => {
  try {
    console.log('Recibida imagen generada:', imageUrl);
    formData.value.content_details.push({
      title: "",
      description: "",
      image: imageUrl,
      preview: imageUrl,
      showPreview: true,
    });
    
    showImageGenerator.value = false;
  } catch (error) {
    console.error("Error al procesar la imagen generada:", error);
  }
};
</script>
