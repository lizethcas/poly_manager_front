<template>
  <div class="my-4">
    <h2 class="text-md font-bold text-gray-700">Images</h2>

    <!-- Gallery items list -->
    <div class="space-y-4">
      <div
        v-for="(item, index) in formData.content_details"
        :key="index"
        class="flex gap-4 items-center"
      >
        <!-- Image preview -->
        <div class="w-52 h-52" v-if="item.preview">
          <img
            :src="item.preview"
            class="w-full h-full object-cover rounded-lg"
            alt="Preview"
          />
        </div>
        <!-- Form fields -->
        <div class="flex-1 flex flex-col gap-2 items-center">
          <MoleculeInput
            title="Title"
            type="text"
            label="false"
            :placeholder="'Enter the heading'"
            class="text-md"
            v-model="item.title"
          />
          <MoleculeInput
            title="Description"
            type="text_area"
            label="false"
            :placeholder="'Enter the description for the image'"
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
      source="gallery"
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
  image: string;
  preview: string;
  showPreview: boolean;
}



const formData = ref({
  ...createBaseTaskData(route.params.classId, "image"),
  content_details: [] as Array<Image>,
});

watch(taskImgGen, (newValue) => {
  if (newValue?.source === 'gallery') {
    formData.value.content_details.push({
      title: "",
      description: "",
      image: newValue.url,
      preview: newValue.url,
      showPreview: true,
    });
  }
});

watch(
  taskInstructions,
  (newValue) => {
    console.log(newValue);
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
    // Preparar las imágenes en el formato correcto
    const images = formData.value.content_details.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.preview, // Mantener el preview completo
    }));

    const contentData = {
      class_id: formData.value.class_id,
      content_type: formData.value.content_type,
      tittle: formData.value.tittle,
      content_details: {
        images: images,
      },
      stats: formData.value.stats,
    };

    console.log("Datos a enviar:", contentData);

    // Validaciones
    if (images.length === 0) {
      throw new Error("Debe agregar al menos una imagen");
    }

    if (!images.every((img) => img.title && img.description && img.image)) {
      throw new Error("Todas las imágenes deben tener título y descripción");
    }

    const response = await mutation.mutateAsync(contentData);
    console.log("Respuesta del servidor:", response);

    if (response.status === "success") {
      taskStore.addTask("modal", { modal: false });
      formData.value.content_details = [];
      formData.value.stats = false;
    } else {
      throw new Error(response.message || "Error al guardar las imágenes");
    }
  } catch (error) {
    console.error("Error al guardar la galería:", error);
    alert(error.message || "Error al guardar las imágenes");
  }
};

// Método para agregar nueva imagen
const addNewImage = async (file: File) => {
  if (!(file instanceof File)) {
    console.error("No es un objeto File válido:", file);
    return;
  }

  try {
    const preview = await getBase64(file);
    formData.value.content_details.push({
      title: "",
      description: "",
      image: file.name,
      preview: preview,
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
  }
};

const removeImage = (index: number) => {
  formData.value.content_details.splice(index, 1);
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
  formData.value.content_details = [];
  formData.value.stats = false;
};

// Add new refs
const showImageGenerator = ref(false);

// Add new method to handle generated images
const handleGeneratedImage = async (imageUrl: string) => {
  try {
    formData.value.content_details.push({
      title: "",
      description: "",
      image: imageUrl,
      preview: imageUrl,
    });
    showImageGenerator.value = false;
  } catch (error) {
    console.error("Error al agregar la imagen generada:", error);
  }
};
</script>
