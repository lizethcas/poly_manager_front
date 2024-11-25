<template>
    <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 my-4 w-full">
            <!-- Label and preview -->
            <label for="file-upload" class="min-w-[120px]">File:</label>
            <div class="w-16 h-16 rounded overflow-hidden">
                <!-- Image preview -->
                <ImgAtom v-if="fileType === 'image' && previewUrl" :image="previewUrl" alt="Preview" />
                <!-- Video preview -->
                <video v-if="fileType === 'video' && previewUrl" :src="previewUrl" controls class="w-full h-full"></video>
                <!-- Audio preview -->
                <audio v-if="fileType === 'audio' && previewUrl" :src="previewUrl" controls class="w-full"></audio>
                <!-- File name for other types -->
                <div v-if="!['image','video','audio'].includes(fileType) && fileName" class="text-sm">
                    {{ fileName }}
                </div>
            </div>

            <!-- Upload button -->
            <UButton color="freshGreen" class="flex justify-center text-white" @click="triggerFileUpload">
                Upload
            </UButton>
        </div>

        <!-- Hidden input -->
        <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="handleChange" />
    </div>
</template>

<script setup>
import ImgAtom from "./atomos/ImgAtom.vue";
import { ref, defineProps, defineEmits } from "vue";

// Props and events
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'file-selected']);

// References
const fileInput = ref(null);
const previewUrl = ref(null);
const fileType = ref(null);
const fileName = ref(null);

// Trigger file input on button click
const triggerFileUpload = () => {
    fileInput.value.click();
};

// Handle file selection
const handleChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        fileName.value = file.name;
        fileType.value = file.type.split('/')[0];
        
        // Create preview URL for supported types
        if(['image', 'video', 'audio'].includes(fileType.value)) {
            previewUrl.value = URL.createObjectURL(file);
        }

        // Emit events
        emit('update:modelValue', previewUrl.value);
        emit('file-selected', file);
    }
};
</script>
