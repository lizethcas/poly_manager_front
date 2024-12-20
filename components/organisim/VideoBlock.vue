<template>
  <div>
    <h3
      class="text-s font-bold text-tarawera-700 my-4"
      v-show="taskTitle === 'video'"
    >
      Main Video:
    </h3>
    <h3
      class="text-s font-bold text-tarawera-700 my-4"
      v-show="taskTitle === 'audio'"
    >
      Audio track:
    </h3>
    <InputFile
      v-show="taskTitle === 'video'"
      fileType="video"
      icon="true"
      @file-selected="handleVideoFile"
    />
    <InputFile
      v-show="taskTitle === 'audio'"
      fileType="audio"
      icon="true"
      @file-selected="handleVideoFile"
    />
    <MoleculeInput
      type="text_area"
      title="Add subtitles:"
      size="lg"
      container-class="py-2"
      @update:modelValue="handleSubtitles"
    />
    <template v-if="taskTitle === 'video'">
      <h3 class="text-s font-bold text-tarawera-700 my-4">Background image:</h3>
      <InputFile
        fileType="image"
        icon="true"
        @file-selected="handleImageFile"
      />
    </template>
    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle v-model="videoData.stats" />
    </div>
    <MoleculeActionButtons
      @handleSave="handleSave()"
      @handleCancel="handleCancel"
      :isActive="infoResponseApi.isActive"
    />
  </div>
</template>
<script setup lang="ts">
import InputFile from "~/components/InputFile.vue";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useTaskStore } from "~/stores/task.store";
import { ref } from "vue";

interface Multimedia {
  media_type: string;
  file: File | null;
  transcription?: string;
}

const taskStore = useTaskStore();
const taskInstructions = computed(() => taskStore.getTask("instructions"));
const taskTitle = ref<string>("video");
const { mutation, isLoading, isSuccess, isError } = useClassContentMutation();
const route = useRoute();
const tempTranscription = ref("");
const infoResponseApi = ref({
  isActive: false,
  isLoading: computed(() => isLoading.value),
  isSuccess: computed(() => isSuccess.value),
  isError: computed(() => isError.value),
  error: null,
  data: null,
});

const videoData = ref({
  ...createBaseTaskData(
    Array.isArray(route.params.classId) 
      ? route.params.classId[0] 
      : route.params.classId,
    taskTitle.value
  ),
  multimedia: [] as Multimedia[],
});

watch(
  taskInstructions,
  (newValue) => {
    if (newValue) {
      videoData.value = {
        ...videoData.value,
        tittle: newValue.title || "",
        instructions: newValue.instructions || "",
      };
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => videoData.value,
  (newValue) => {
    console.log("videoData changed:", newValue);
  },
  { deep: true }
);

watch(taskTitle, (newValue) => {
  console.log("taskTitle changed:", newValue);
  taskTitle.value = newValue;
  console.log("taskTitle changed:", taskTitle.value);
});


const handleVideoFile = (file: File) => {
  if (taskTitle.value === "video") {    
    if (!file.type.startsWith("video/")) {
      console.error("El archivo seleccionado no es un video");
      return;
    }
  }
  if (taskTitle.value === "audio") {
    if (!file.type.startsWith("audio/")) {
      console.error("El archivo seleccionado no es un audio");
      return;
    }
  }

  videoData.value.multimedia.push({
    media_type: taskTitle.value,
    file: file,
    transcription: tempTranscription.value, // Usar la transcripción temporal si existe
  });
  infoResponseApi.value.isActive = true;
  console.log("Video added:", videoData.value.multimedia);
};

const handleImageFile = (file: File) => {
  videoData.value.multimedia.push({
    media_type: "image",
    file: file,
  });
};

const handleSubtitles = (value: string) => {
  // Guardar siempre el valor en la transcripción temporal
  tempTranscription.value = value;

  // Si hay un video, actualizar su transcripción
  if (videoData.value.multimedia.length > 0) {
    const videoIndex = videoData.value.multimedia.findIndex(
      (item) => item.media_type === "video"
    );
    if (videoIndex !== -1) {
      videoData.value.multimedia = [
        ...videoData.value.multimedia.map((item, index) => {
          if (index === videoIndex) {
            return {
              ...item,
              transcription: value,
            };
          }
          return item;
        }),
      ];
    }
  }
};

watch(
  () => videoData.value.multimedia,
  (newValue) => {
    console.log("Multimedia updated:", newValue);
  },
  { deep: true }
);

const handleSave = async () => {
  try {
    const requestData = {
      class_model: videoData.value.class_id,
      content_type: videoData.value.content_type,
      tittle: videoData.value.tittle,
      instructions: videoData.value.instructions,
      multimedia: videoData.value.multimedia.map(item => ({
        media_type: item.media_type,
        file: item.file,
        transcription: item.transcription || ''
      }))
    };

    const result = await mutation.mutateAsync(requestData);
    
    // Actualizar el estado con las URLs recibidas del backend
    if (result.multimedia) {
      videoData.value.multimedia = result.multimedia.map(item => ({
        ...item,
        file_url: item.file // Asumiendo que el backend devuelve la URL en el campo file
      }));
    }

    // Limpiar el formulario o realizar otras acciones necesarias
  } catch (error) {
    console.error('Error saving content:', error);
  }
};

const handleCancel = () => {
  console.log("Cancel");
};
</script>
