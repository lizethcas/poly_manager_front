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
        <div class="w-24 h-24" v-if="item.image_gallery">
          <img
            :src="item.preview_url"
            class="w-full h-full object-cover rounded-lg"
            alt="Preview"
          />
        </div>
        <!-- Form fields -->
        <div class="flex-1 flex flex-col gap-2" v-if="item.image_gallery">
          <MoleculeInput
            title="Title"
            type="text"
            class="text-md"
            v-model="item.title_gallery"
          />
          <MoleculeInput
            title="Description"
            type="text_area"
            :size="'md'"
            v-model="item.description_gallery"
            class="text-md"
          />
        </div>
      </div>
    </div>

    <!-- Upload new image button -->
    <InputFile
      fileType="image"
      icon="true"
      @file-selected="addNewImage"
      class="mt-4"
    />

    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle v-model="formData.stats" />
    </div>

    <MoleculeActionButtons
      @handleSave="handleSave()"
      @handleCancel="handleCancel"
      :isActive="isFormValid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useRoute } from "vue-router";
import { useClassContentMutation } from "~/composables/useClassContentMutation";

const route = useRoute();
const taskStore = useTaskStore();
const taskInstructions = computed(() => taskStore.getTask("instructions"));
const mutation = useClassContentMutation();

interface FormData {
  title_gallery: string;
  description_gallery: string;
  image_gallery: File | null;
  preview_url?: string;
}

const formData = ref({
  ...createBaseTaskData(String(route.params.classId), "image"),
  content_details: [] as FormData[], // Inicializar como array vacío
});

// Computed property to check if all fields are filled
const isFormValid = computed(() => {
  if (formData.value.content_details.length === 0) return false;

  return formData.value.content_details.every(
    (item) =>
      item.title_gallery.trim() !== "" &&
      item.description_gallery.trim() !== "" &&
      item.image_gallery !== null
  );
});

// Add new image to the gallery
const addNewImage = (file: File) => {
  if (!(file instanceof File)) {
    console.error('Not a valid File object:', file);
    return;
  }
  
  const preview_url = URL.createObjectURL(file);
  const newItem = reactive({
    title_gallery: "",
    description_gallery: "",
    image_gallery: file,
    preview_url: preview_url
  });
  
  formData.value.content_details.push(newItem);
  
  console.log('Se agregó una nueva imagen:', formData.value.content_details);
};

// Add cleanup function for URLs when component is unmounted
onBeforeUnmount(() => {
  formData.value.content_details.forEach(item => {
    if (item.preview_url) {
      URL.revokeObjectURL(item.preview_url);
    }
  });
});

watch(
  taskInstructions,
  (newValue) => {
    if (newValue) {
      formData.value = {
        ...formData.value,
        tittle: newValue.title || "",
        instructions: newValue.instructions || "",
      };
    }
  },
  { deep: true, immediate: true }
);



const handleSave = async () => {
  try {
    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append("class_id", String(route.params.classId));
    formDataToSend.append("content_type", "image");
    formDataToSend.append("tittle", formData.value.tittle);
    formDataToSend.append("instructions", formData.value.instructions);
    formDataToSend.append("stats", String(formData.value.stats));

    // Add each gallery item
    formData.value.content_details.forEach((item, index) => {
      formDataToSend.append(
        `content_details[${index}][title_gallery]`, 
        item.title_gallery
      );
      formDataToSend.append(
        `content_details[${index}][description_gallery]`, 
        item.description_gallery
      );
      if (item.image_gallery instanceof File) {
        formDataToSend.append(
          `content_details[${index}][image_gallery]`, 
          item.image_gallery
        );
      }
    });

    // Añadir el JSON de content_details
    console.log("Sending data:", {
      class_id: formData.value.class_id,
      content_type: formData.value.content_type,
      tittle: formData.value.tittle,
      instructions: formData.value.instructions,
      content_details: formData.value.content_details,
      stats: formData.value.stats,
    });

    await mutation.mutateAsync(formDataToSend);
    handleCancel();
  } catch (error) {
    console.error("Error saving gallery:", error);
  }
};

const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
  formData.value = {
    ...createBaseTaskData(String(route.params.classId), "image"),
    content_details: [],
  };
};
</script>
