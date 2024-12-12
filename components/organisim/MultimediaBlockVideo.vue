<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video" @file-selected="data.video = $event" />

        <h3 class="text-s font-bold text-tarawera-700 my-4">Subtitle:</h3>
        <textarea v-model="data.script" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>

        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" @file-selected="data.cover = $event" />
    </div>

    <!-- Display loading, success, and error states based on Vue Query's state -->
    <div class="flex items-center gap-2 py-4 text-sm">
        <p>Include the stats</p>
        <AtomosToggle />
    </div>
    <div v-if="infoResponseApi.isLoading"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <p class="text-title-color text-2xl">Guardando...</p>
    </div>
    <div v-if="infoResponseApi.isSuccess"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <p class="text-title-color text-2xl">Guardado correctamente</p>
    </div>

    <MoleculeActionButtons @handleSave="handleSave()" @handleCancel="handleCancel"
        :isActive="infoResponseApi.isActive" />
</template>


<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import { useToast } from 'vue-toastification'
import { useMutation } from '@tanstack/vue-query';
import { useTaskStore } from '~/stores/task.store';
import { ref, computed, watch } from 'vue';
import { apiRoutes } from '~/services/routes.api';
import axiosInstance from '~/services/axios.config';
import { useRoute } from 'vue-router';
// Store and state management

const route = useRoute();
const toast = useToast()
const taskStore = useTaskStore();
const infoResponseApi = ref({
    isActive: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,
});

const selectedOption = computed(() => taskStore.getTask('selectedOption'));
const taskInstructions = computed(() => taskStore.getTask('instructions'));

// Data object for form fields
const data = ref({
    class_id: route.params.classId,
    video: null as File | null,
    script: '',
    cover: null as File | null,
    title: '',
    instructions: ''
});

watch(taskInstructions, (newValue) => {
    if (newValue) {
        Object.assign(data.value, {
            title: newValue.title || '',
            instructions: newValue.instructions || ''
        });
    }
}, { deep: true });

watch(data, (newValue) => {
    if (newValue.video || newValue.cover) {
        infoResponseApi.value.isActive = true;
    }
}, { deep: true });

// Handle file name cleanup
const multimedia = (file: File) => {
    const newFileName = file.name.replace(/\s+/g, '_');
    const newFile = new File([file], newFileName, { type: file.type });
    return newFile;
};

// Define mutation for the API call
const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
        infoResponseApi.value.isLoading = true;
        const response = await axiosInstance.post(apiRoutes.multimediaBlockVideos, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        infoResponseApi.value.isLoading = false;
        toast.success("Operation completed successfully!")
        return response.data;
    },
    onSuccess: (data) => {
        console.log('Response from API:', data);
        infoResponseApi.value.isSuccess = true;
        taskStore.addTask('modal', { modal: false });
    },
    onError: (error) => {
        console.error('Error saving data:', error);
        infoResponseApi.value.isError = true;
    },
});

const handleCancel = () => {
    taskStore.addTask('modal', { modal: false });
}

// Save data function using FormData
const handleSave = async () => {
    if (selectedOption.value === 'video') {
        try {
            const formData = new FormData();

            // Handle video file
            if (data.value.video instanceof File) {
                const newFileName = data.value.video.name.replace(/\s+/g, '_');
                const newVideoFile = new File([data.value.video], newFileName, {
                    type: data.value.video.type
                });
                formData.append('video', newVideoFile);
            } else {
                console.error('Video is not a File object');
            }

            // Handle background image
            if (data.value.cover instanceof File) {
                const newFileName = data.value.cover.name.replace(/\s+/g, '_');
                const newImageFile = new File([data.value.cover], newFileName, {
                    type: data.value.cover.type
                });
                formData.append('cover', newImageFile);
            }

            // Append other data
            formData.append('script', data.value.script);
            formData.append('title', data.value.title);
            formData.append('instructions', data.value.instructions);
            formData.append('class_id', String(data.value.class_id));
            console.log('Form data:', data.value);
            // Trigger the mutation
            mutation.mutate(formData);

        } catch (error) {
            console.error('Error saving multimedia block:', error);
            throw error;
        }
    }
};
</script>
