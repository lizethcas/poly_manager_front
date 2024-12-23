<template>
  <form @submit.prevent="handleSave">
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
      @file-selected="form.video = $event"

    />
    <InputFile
      v-show="taskTitle === 'audio'"
      fileType="audio"
      icon="true"
      @file-selected="form.audio = $event"
    />
    <MoleculeInput
      type="text_area"
      title="Add subtitles:"
      size="lg"
      container-class="py-2"
      @update:modelValue="taskTitle === 'video' ? form.video_transcription = $event : form.audio_transcription = $event"
    />
    <template v-if="taskTitle === 'video'">
      <h3 class="text-s font-bold text-tarawera-700 my-4">Background image:</h3>
      <InputFile
        fileType="image"
        icon="true"
        @file-selected="form.image = $event"
      />
    </template>
    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle />
    </div>
    <MoleculeActionButtons
      @handleSave="handleSave"
      @handleCancel="handleCancel"
      :isActive="true"
  
    />

  </form>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
const taskTitle = ref<string>("video");
import { useTaskStore } from "~/stores/task.store";
import { useMutation } from '@tanstack/vue-query'
import { apiRoutes } from '~/services/routes.api'
import axiosInstance from '~/services/axios.config'

const route = useRoute();
const taskStore = useTaskStore();
const taskInstructions = computed(() => taskStore.getTask("instructions"));

/* interface MultimediaItem {
  media_type: "image" | "video" | "audio";
  file: File | null;
  transcription?: string;
}
 */
interface Form {
  tittle: string;
  instructions: string;
  video_transcription: string;
  audio_transcription: string;
  image: File | null;
  video: File | null;
  audio: File | null;
}

const form = reactive<Form>({
  tittle: "",
  instructions: "",
  video_transcription: "",
  audio_transcription: "",
  image: null,
  video: null,
  audio: null,
});

const updateDescription = (value: string) => {
  form.video_transcription = value;
};

const classContentMutation = useMutation({
  mutationFn: async (formData: FormData) => {
    const response = await axiosInstance.post(apiRoutes.classContent, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30 * 60 * 1000,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    })
    return response.data
  },
  onSuccess: (data) => {
    console.log('Content saved successfully:', data)
  },
  onError: (error) => {
    console.error('Error saving content:', error)
  }
})

const handleSave = async () => {
  // First, ensure multimedia array exists and has items


  const formData = new FormData();
  
  // Add basic form data
  formData.append("class_id", route.params.classId.toString());
  formData.append("content_type", taskTitle.value);
  formData.append("tittle", form.tittle);
  formData.append("instructions", form.instructions);
  formData.append("video_transcription", form.video_transcription);
  formData.append("audio_transcription", form.audio_transcription);
  formData.append("image", form.image);
  formData.append("video", form.video);
  if (form.audio) {
    formData.append("audio", form.audio);
  }

  // Log multimedia array state before processing
 
  // Add multimedia files and data
 

  // Log complete FormData
  

  try {
    const response = await classContentMutation.mutateAsync(formData);
    console.log('Full server response:', response);
  } catch (error) {
    console.error('Error details:', error);
  }
};

/* const infoResponseApi = ref({
  isActive: false,
  isLoading: computed(() => isLoading.value),
  isSuccess: computed(() => isSuccess.value),
  isError: computed(() => isError.value),
  error: null,
  data: null,
}); */

const handleCancel = () => {
  console.log("Cancel");
};



watch(
  taskInstructions,
  (newValue) => {
    form.tittle = newValue.title || "";
    form.instructions = newValue.instructions || "";
  },
  { deep: true }
);

watch(form, (newValue) => {
  console.log("form", newValue);
});

/* import InputFile from "~/components/InputFile.vue";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useTaskStore } from "~/stores/task.store";
import { ref } from "vue";

interface Multimedia {
  media_type: string;
  file: File | null;
  file_url?: string;
  transcription?: string;
}

const taskStore = useTaskStore();
const taskInstructions = computed(() => taskStore.getTask("instructions"));

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
    parseInt(Array.isArray(route.params.classId)
      ? route.params.classId[0]
      : route.params.classId),
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
  if (taskTitle.value === "video" && !file.type.startsWith("video/")) {
    console.error("El archivo seleccionado no es un video");
    return;
  }
  if (taskTitle.value === "audio" && !file.type.startsWith("audio/")) {
    console.error("El archivo seleccionado no es un audio");
    return;
  }

  const newFileName = file.name.replace(/\s+/g, '_');
  const newFile = new File([file], newFileName, { type: file.type });

  videoData.value.multimedia = videoData.value.multimedia.filter(
    item => item.media_type !== taskTitle.value
  );

  videoData.value.multimedia.push({
    media_type: taskTitle.value,
    file: newFile,
    transcription: tempTranscription.value,
  });
  infoResponseApi.value.isActive = true;
};

const handleImageFile = (file: File) => {
  const newFileName = file.name.replace(/\s+/g, '_');
  const newFile = new File([file], newFileName, { type: file.type });

  videoData.value.multimedia.push({
    media_type: "image",
    file: newFile,
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
    const class_id = Number(videoData.value.class_id);

    console.log('class_id type:', typeof class_id);
    console.log('class_id value:', class_id);

    const requestData = {
      class_id: class_id,
      content_type: videoData.value.content_type,
      tittle: videoData.value.tittle,
      instructions: videoData.value.instructions,
      multimedia: videoData.value.multimedia.map((item) => ({
        media_type: item.media_type,
        file: item.file,
        transcription: item.transcription || "",
      })),
    };

    const result = await mutation.mutateAsync(requestData);

    // Actualizar el estado con las URLs recibidas del backend
    if (result.multimedia) {
      videoData.value.multimedia = result.multimedia.map((item) => ({
        ...item,
        file_url: item.file, // Asumiendo que el backend devuelve la URL en el campo file
      }));
    }

    // Limpiar el formulario o realizar otras acciones necesarias
  } catch (error) {
    console.error("Error saving content:", error);
  }
}; */
import { createBaseTaskData } from "~/interfaces/task.interface";
</script>
