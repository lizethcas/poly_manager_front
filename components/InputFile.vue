<template>
    <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 my-1 w-full">
            <div v-if="icon">
                <label for="file-upload" class="min-w-[120px] text-primary-color font-bold text-sm">{{ title }}</label>
                <div @click="triggerFileUpload"
                    class="hover:text-fuscous-gray-600 p-2 bg-fuscous-gray-100 min-w-20 max-w-8 w-full text-center rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 group  ">
                    <Icon name="material-symbols:upload" class="text-fuscous-gray-400 group-hover:text-fuscous-gray-600"
                        size="20" />
                    <p class="text-fuscous-gray-400 group-hover:text-fuscous-gray-600 text-xs">Upload</p>
                </div>
            </div>

            <!-- Label and preview -->
            <label v-if="!icon" for="file-upload" class="min-w-[120px] text-middele-gray">File:</label>
            <div class="w-16 h-16 rounded overflow-hidden">
                <slot></slot>
                <!-- Image preview -->
                <ImgAtom v-if="fileType === 'image' && previewUrl" :image="previewUrl" alt="Preview" />
                <!-- Video preview -->
                <video v-if="fileType === 'video' && previewUrl" :src="previewUrl" controls
                    class="justify-between w-full h-full"></video>
                <!-- Audio preview -->
                <audio v-if="fileType === 'audio' && previewUrl" :src="previewUrl" controls class="w-full"></audio>
                <!-- File name for other types -->
                <div v-if="!['image', 'video', 'audio'].includes(fileType) && fileName" class="text-sm">
                    {{ fileName }}
                </div>
            </div>

            <!-- Upload button -->
             <UButton v-if="!icon" class="flex justify-center text-white hover:scale-105 hover:bg-primary-color transition-all duration-300 bg-primary-color" @click="triggerFileUpload">
                Upload
            </UButton>


        </div>

        <!-- Hidden input -->
        <input id="file-upload" type="file" class="hidden" ref="fileInput" @change="handleChange" accept=".pdf,.doc,.docx" />

    </div>
</template>

<script setup>
import ImgAtom from "./atomos/ImgAtom.vue";
import { ref, defineProps, defineEmits } from "vue";
import EventBus from '~/composables/useEvenBus';
// Props and events
const props = defineProps(['modelValue', 'title', 'icon']);
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
        if (['image', 'video', 'audio'].includes(fileType.value)) {
            previewUrl.value = URL.createObjectURL(file);
        }

        // Emit events
        EventBus.emit('file-selected', { url: URL.createObjectURL(file), fileType: file.type.split('/')[0] });
        emit('update:modelValue', previewUrl.value);
        emit('file-selected', file);
    }
};
</script>
