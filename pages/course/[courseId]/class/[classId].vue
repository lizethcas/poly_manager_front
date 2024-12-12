<template>
    <div class="w-full">
        <!-- <Task v-if="datatask.length > 0" :questions="datatask.value.questions" />
        <div v-if="datatask.questions.length === 0"
            class="font-bold flex justify-center items-center text-center h-screen text-fuscous-gray-950 text-md ">

            <div>
                <p>There are no activities created for this course yet.</p>
                <button @click="showEditNavigation = true"
                    class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">Add
                    Block</button>
            </div>
        </div> -->
        <button @click="showEditNavigation = true"
            class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">Add
            Block</button>
        <transition name="slide-up" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <EditClassNavigation v-if="showEditNavigation" @open-modal="openModalHandler" />
        </transition>
        <div v-if="isOpen">
            <BaseTaskModal :is-open="isOpen" @close="closeModal" :title="currentModal.label" v-model="formData"
                class="max-h-[80vh]  overflow-y-auto" :icon="currentModal.name">

                <component :is="getCurrentComponent()" />

                <!-- <div class="flex items-center gap-2 py-4 text-sm">
                    <p>Include the stats</p>
                    <AtomosToggle />
                </div> -->
                <!--                 <MoleculeActionButtons @handleSave="handleSave()" @handleCancel="$emit('close')" />
 -->
            </BaseTaskModal>
        </div>
        <div v-if="isError" class="error-message">
            <p>An error occurred while saving data. Please try again later.</p>
        </div>
        <div v-if="isLoading" class="loading-message">
            <p>Saving data...</p>
        </div>
        <div v-if="isSuccess" class="success-message">
            <p>Data saved successfully.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import OrganisimLayoutBlock from '~/components/organisim/LayoutBlock.vue';
import { useTaskStore } from '~/stores/task.store';
import { useMultipleChoice } from '~/services/multiplechoice.api';
import { ApiMultimediaBlockVideoService } from '~/services/multimediablockvideos.api';

const { save, isLoading, isError, isSuccess, get } = useMultipleChoice();
const { isOpen, closeModal, openModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();

const taskStore = useTaskStore();
const currentModal = ref({ label: '', name: '' });
const formData = ref({ title: '', instructions: '' });
const showEditNavigation = ref(false);
const multipleTasksData = ref({});
const multimediaBlockVideoData = ref({});

const closeModalHandler = computed(() => taskStore.getTask('modal'));
watch(closeModalHandler, () => {
    closeModal();
})

// Escuchar el evento y pasar los valores recibidos


const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };

    EventBus.on('multiple-tasks-data', (data) => {
        multipleTasksData.value = data;


    })
    EventBus.on('questions', (questions) => {
        questions.value = questions;
        console.log(questions.value);
    })

    EventBus.on('multimedia-block-video', (data) => {
        multimediaBlockVideoData.value = data;
        console.log(data);
    })


    openModal();  // Asegúrate de abrir el modal
};


const getCurrentComponent = () => {
    switch (currentModal.value.label) {
        case 'Layout block': return OrganisimLayoutBlock;
        case 'Video layout': return VideoBlock;
        case 'Text block': return TextBlock;
        case 'Multimedia block': return MultimediaBlock;
        case 'Interactive activities': return InteractiveActivities;
        default: return null; // Devolver null si no hay coincidencia
    }
};


const handleSave = async () => {
    try {
        if (currentModal.value.label === 'Layout block') {
            await save(multipleTasksData.value);
            closeModal();
        }

        if (currentModal.value.label === 'Multimedia block') {
            const apiService = new ApiMultimediaBlockVideoService();
            const response = await apiService.createMultimediaBlockVideo(multimediaBlockVideoData.value);
            closeModal();
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
};
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
