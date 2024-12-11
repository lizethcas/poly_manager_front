<template>
    <div class="w-full">
        <Task v-if="tasksStore.questions.length > 0" :questions="tasksStore.questions" />
        <div v-if="tasksStore.questions.length === 0"
            class="font-bold flex justify-center items-center text-center h-screen text-fuscous-gray-950 text-md ">

            <div>
                <p>There are no activities created for this course yet.</p>
                <button @click="showEditNavigation = true"
                    class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">Add
                    Block</button>
            </div>
        </div>
        <button v-if="tasksStore.questions.length > 0" @click="showEditNavigation = true"
            class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">Add
            Block</button>
        <transition name="slide-up" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <EditClassNavigation v-if="showEditNavigation" @open-modal="openModalHandler" />
        </transition>
        <div v-if="isOpen">
            <BaseTaskModal :is-open="isOpen" @close="closeModal" :title="currentModal.label" v-model="formData"
                class="max-h-[80vh]  overflow-y-auto" :icon="currentModal.name">
                <div>
                    <OrganisimLayoutBlock v-if="currentModal.label === 'Layout block'" />
                    <VideoBlock v-if="currentModal.label === 'Video layout'" />
                    <TextBlock v-if="currentModal.label === 'Text block'" />
                    <MultimediaBlock v-if="currentModal.label === 'Multimedia block'" />
                    <InteractiveActivities v-if="currentModal.label === 'Interactive activities'" />
                </div>
                <div class="flex items-center gap-2 py-4 text-sm">
                    <p>Include the stats</p>
                    <AtomosToggle />
                </div>
                <MoleculeActionButtons @handleSave="handleSave()" @handleCancel="$emit('close')" />

            </BaseTaskModal>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';
import { useAnimation } from '~/composables/useAnimation';
import EventBus from '~/composables/useEvenBus';

import Task from '~/components/organisim/task.vue';
import VideoBlock from '~/components/organisim/VideoBlock.vue';
import TextBlock from '~/components/organisim/TextBlock.vue';
import MultimediaBlock from '~/components/organisim/MultimediaBlock.vue';
import InteractiveActivities from '~/components/organisim/InteractiveActivities.vue';
import { useTasksStore } from '~/stores/tasks.store';
import axiosInstance from '~/services/axios.config';






const { isOpen, openModal, closeModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();
const tasksStore = useTasksStore();
const queryClient = useQueryClient();

const currentModal = ref({ label: '', name: '' });
const formData = ref({ title: '', instructions: '' });
const showEditNavigation = ref(false);
const multipleTasksData = ref({});
// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };

    EventBus.on('multiple-tasks-data', (data) => {
        multipleTasksData.value = data;

    })
    openModal();  // Asegúrate de abrir el modal
};

const mutation = useMutation({
  mutationFn: (data) => {
    return axiosInstance.post('multiplechoice/', data);
  },
  onSuccess: () => {
    // Handle success
    console.log('Multiple choice task saved successfully');
    // You might want to invalidate and refetch the tasks query
    queryClient.invalidateQueries(['multipleTasks']);
  },
  onError: (error) => {
    // Handle error
    console.error('Error saving multiple choice task:', error);
  }
});

const handleSave = async () => {
    if (currentModal.value.label === 'Layout block') {
        try {
            // Execute the mutation with the data
            await mutation.mutate(multipleTasksData.value);
            closeModal();
        } catch (error) {
            console.error('Error in handleSave:', error);
        }
    }
    closeModal();
}
</script>

/* switch (title) {
    case 'Layout block':
        console.log(toRaw(combinedData.value));
        tasksStore.saveTask(combinedData.value);
        closeModal();
        console.log(title);
        break;
    case 'Video layout':
        console.log(title);
        break;
    case 'Text layout':
        console.log(title);
        break;
    case 'Audio layout':
        console.log(title);
        break;
    case 'Info block':
        console.log(title);
        break;
    case 'SCORM file':
        console.log(title);
        break;
    case 'Gallery layout':
        console.log(title);
        break;
    case 'AI chat':
        console.log(title);
        break;
    case 'Multimedia block':
        console.log(title);
        break;
    case 'Interactive activities':
        console.log(title);
        break;
    case 'Knowledge check':
        console.log(title);
        break;
    case 'Word list':
        console.log(title);
        break;
    case 'Table':
        console.log(title);
        break;
    case 'Dividers':
        console.log(title);
        break;
    default:
        console.log(title);
        break;
}
 */
