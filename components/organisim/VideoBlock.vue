<template>
  <form @submit.prevent="handleSave">
    <h3
      class="text-s font-bold text-tarawera-700 my-4"
      v-show="taskTitle === 'Video'"
    >
      Main Video:
    </h3>
    <h3
      class="text-s font-bold text-tarawera-700 my-4"
      v-show="taskTitle === 'Audio'"
    >
      Audio track:
    </h3>
    <InputFile
      v-show="taskTitle === 'Video'"
      fileType="video"
      icon="true"
      @file-selected="form.video = $event"
    />
    <InputFile
      v-show="taskTitle === 'Audio'"
      fileType="audio"
      icon="true"
      @file-selected="form.audio = $event"
    />
    <MoleculeInput
      type="text_area"
      title="Add subtitles:"
      size="lg"
      container-class="py-2"
      @update:modelValue="
        taskTitle === 'Video'
          ? (form.video_transcription = $event)
          : (form.audio_transcription = $event)
      "
    />
    <template v-if="taskTitle === 'Video'">
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
      :isActive="isActive"
    />
    <UProgress
      v-if="isLoading"
      animation="carousel"
      class="mt-4"
      :ui="{ color: 'freshGreen' }"
    />
  </form>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
const taskTitle = ref<string>("Video");
import { useTaskStore } from "~/stores/task.store";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes } from "~/services/routes.api";
import { axiosDashboard } from "~/services/axios.config";
import { useNotify } from '~/composables/useNotify'

const { notify } = useNotify();
const queryClient = useQueryClient();
const route = useRoute();
const taskStore = useTaskStore();
const taskInstructions = computed(() => taskStore.getTask("instructions"));
const tiitle = computed(() => taskStore.getTask("taskTitle"));

const isActive = ref(false);

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
  image: null as File | null,
  video: null as File | null,
  audio: null as File | null,
});

const classContentMutation = useMutation({
  mutationFn: async (formData: FormData) => {
    const response = await axiosDashboard.post(
      apiRoutes.classContent,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30 * 60 * 1000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );
    return response.data;
  },
  onSuccess: (data) => {
    notify.success("Content saved successfully");
  },
  onError: (error) => {
    notify.error("Error saving content");
  },
});

const isLoading = computed(() => classContentMutation.isPending.value);
const handleSave = async () => {
  const formData = new FormData();

  // Add basic form data
  formData.append("class_id", route.params.classId.toString());
  formData.append("content_type", taskTitle.value.toLowerCase());
  formData.append("tittle", form.tittle);
  formData.append("instructions", form.instructions);
  formData.append("video_transcription", form.video_transcription);
  formData.append("audio_transcription", form.audio_transcription);


  if (taskTitle.value === "Video") {
    formData.append("image", form.image as Blob);
    formData.append("video", form.video as Blob);
  }
  if (taskTitle.value === "Audio") {
    formData.append("audio", form.audio as Blob);
  }

  try {
    const response = await classContentMutation.mutateAsync(formData);

    // Invalidate and refetch the class contents query
    await queryClient.invalidateQueries({
      queryKey: ["class-contents", route.params.classId],
    });

    // Close the modal
    handleCancel();
  } catch (error) {
    console.error("Error details:", error);
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
  taskStore.addTask("modal", { modal: false });
};

watch(tiitle, (newValue) => {
  taskTitle.value = newValue;
});

watch(
  taskInstructions,
  (newValue) => {
    form.tittle = newValue.title || "";
    form.instructions = newValue.instructions || "";
  },
  { deep: true }
);

watch(form, (newValue) => {
  isActive.value = Boolean(newValue.video || newValue.audio);
});

// Add proper interface for task prop if it's being used
interface Task {
  id: number;
  class_id: number;
  content_type: string;
  tittle: string;
  content_details: any;
  // ... add other properties as needed
}

// Add props definition with proper type validation
defineProps<{
  index?: number;  // Make it optional but ensure it's a number
  task?: Task;
}>()
</script>
