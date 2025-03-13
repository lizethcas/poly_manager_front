<template>
  <div class="flex flex-col items-start">
    <div class="flex items-center gap-4 my-1 w-full">
      <div v-if="icon">
        <label
          for="file-upload"
          class="w-fit text-primary-color font-bold text-sm"
          >{{ title }}</label
        >
        <button
          type="button"
          @click="triggerFileUpload"
          class="hover:text-fuscous-gray-600 p-2 bg-fuscous-gray-100 min-w-20 max-w-8 w-full text-center rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 group"
        >
          <Icon
            name="material-symbols:upload"
            class="text-fuscous-gray-400 group-hover:text-fuscous-gray-600"
            size="20"
          />

          Upload
        </button>
      </div>

      <!-- Label and preview -->
      <label v-if="!icon" for="file-upload" class="w-fit text-middele-gray"
        >File:</label
      >
      <div
        v-if="showPreview"
        :class="['rounded overflow-hidden', fileTypeClasses]"
      >
        <!-- Image preview -->
        <ImgAtom
          v-if="fileType === 'image' && (previewUrl || props.previewUrl)"
          :image="previewUrl || props.previewUrl"
          alt="Preview"
          class="w-full h-full object-cover"
        />
        <!-- Video preview -->
        <video
          v-else-if="fileType === 'video' && (previewUrl || props.previewUrl)"
          :src="previewUrl || props.previewUrl"
          controls
          class="w-full h-full object-cover"
        ></video>
        <!-- Audio preview -->
        <audio
          v-else-if="fileType === 'audio' && (previewUrl || props.previewUrl)"
          :src="previewUrl || props.previewUrl"
          controls
        ></audio>

        <!-- File name for other types -->
        <div
          v-if="!['image', 'video', 'audio'].includes(fileType) && fileName"
          class="text-sm"
        >
          {{ fileName }}
        </div>
      </div>

      <!-- Upload button -->

      <div v-if="!icon" class="flex flex-col gap-2">
        <UButton
          type="button"
          class="flex justify-center text-white hover:scale-105 hover:bg-primary-color transition-all duration-300 bg-primary-color"
          @click="triggerFileUpload"
        >
          Upload
        </UButton>
        <UButton
          type="button"
          class="block text-white hover:scale-105 hover:bg-primary-color transition-all duration-300 bg-primary-color"
          @click="$emit('crop')"
        >
          Crop
        </UButton>
        <UButton
          type="button"
          class="block text-white hover:scale-105 hover:bg-primary-color transition-all duration-300 bg-primary-color"
          @click="deleteFile"
        >
          Delete
        </UButton>
      </div>
    </div>

    <!-- Hidden input -->
    <input
      id="file-upload"
      type="file"
      class="hidden"
      ref="fileInput"
      @change="handleChange"
      :accept="accept"
    />
  </div>
</template>

<script setup lang="ts">
import ImgAtom from "./atomos/ImgAtom.vue";
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  watch,
  onUnmounted,
  computed,
} from "vue";
import { useTaskStore } from "~/stores/task.store";

// Tipo más específico para fileType
type FileType = "image" | "video" | "audio" | "other";

interface FileInputProps {
  accept?: string;
  maxSize?: number;
  title?: string;
  icon?: boolean;
  showPreview?: boolean;
  previewUrl?: string;
  fileType?: FileType;
}

const props = withDefaults(defineProps<FileInputProps>(), {
  title: "Upload File",
  icon: false,
  showPreview: true,
  previewUrl: "",
  accept: "image/*,video/*,audio/*",
  maxSize: 10,
  fileType: "other",
});

const emit = defineEmits<{
  "update:modelValue": [File | null];
  "file-selected": [{ file: File; preview: string }];
  "file-error": [string];
  crop: boolean;
}>();

const taskStore = useTaskStore();
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string>(props.previewUrl || "");
const fileType = ref<string>("");
const fileName = ref<string | null>(null);

const FILE_SIZE_LIMIT = props.maxSize;
const MAX_IMAGE_DIMENSION = 5000;
const VALID_CATEGORIES = ["image", "video", "audio"];

// Update onMounted to handle initial preview
onMounted(() => {
  if (props.previewUrl) {
    fileType.value = getFileTypeFromUrl(props.previewUrl);
    previewUrl.value = props.previewUrl;
  }
});

// Add helper function to determine file type from URL
const getFileTypeFromUrl = (url: string): string => {
  // Detectar URLs de blob que suelen ser imágenes en este contexto
  if (url.startsWith("blob:")) return "image";

  const extension = url.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
  if (["mp4", "webm", "ogg"].includes(extension)) return "video";
  if (["mp3", "wav"].includes(extension)) return "audio";
  return "other";
};

// Trigger file input on button click
const triggerFileUpload = () => {
  fileInput.value.click();
};

watch(
  previewUrl,
  (newValue) => {
    taskStore.addTask("filePreview", newValue);
  },
  { deep: true }
);

// Simplified file handling with clear validation
const handleChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  // Clear previous state
  previewUrl.value = "";
  fileName.value = "";
  fileType.value = "";

  if (!file) {
    emit("update:modelValue", null);
    return;
  }

  try {
    // Validate file
    await validateFile(file);

    // Update component state
    fileName.value = file.name;
    fileType.value = getFileCategory(file.type);
    previewUrl.value = URL.createObjectURL(file);

    // Emit consistent events
    emit("update:modelValue", file);
    emit("file-selected", {
      file,
      preview: previewUrl.value,
    });
  } catch (error) {
    emit("file-error", error.message);
    // Reset input
    input.value = "";
  }
};

// Clear validation functions
const validateFile = async (file: File): Promise<void> => {
  // Size validation
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > FILE_SIZE_LIMIT) {
    throw new Error(`File size exceeds ${FILE_SIZE_LIMIT}MB limit`);
  }

  // Type validation
  if (!isValidFileType(file)) {
    throw new Error("Unsupported file type");
  }

  // For images, validate dimensions if needed
  if (file.type.startsWith("image/")) {
    await validateImageDimensions(file);
  }
};

const validateImageDimensions = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      // Example validation: max 5000x5000
      if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        reject(new Error("Image dimensions too large"));
      }
      resolve();
    };
    img.onerror = () => reject(new Error("Invalid image file"));
  });
};

const getFileCategory = (mimeType: string): string => {
  const category = mimeType.split("/")[0];
  return ["image", "video", "audio"].includes(category) ? category : "other";
};

const isValidFileType = (file: File): boolean => {
  const acceptedTypes = props.accept
    .split(",")
    .map((type) => type.trim())
    .map((type) => type.replace("*", ""));

  return acceptedTypes.some((type) => file.type.startsWith(type));
};

// Cleanup URLs on component unmount
onUnmounted(() => {
  if (previewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const deleteFile = () => {
  previewUrl.value = "";
  fileName.value = "";
  fileType.value = "";
};

const fileTypeClasses = computed(() => {
  if (fileType.value === "video") return "w-64 h-36";
  if (fileType.value === "audio") return "";
  return "w-16 h-16";
});
</script>
