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
import { ref, watch, onMounted } from 'vue';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';
import { useAnimation } from '~/composables/useAnimation';
import EventBus from '~/composables/useEvenBus';
import type { Question } from '~/interfaces/components/props.components.interface';
import Task from '~/components/organisim/task.vue';
import VideoBlock from '~/components/organisim/VideoBlock.vue';
import { useTasksStore } from '~/stores/tasks.store';

const { isOpen, openModal, closeModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();
const tasksStore = useTasksStore();

const currentModal = ref({ label: '', name: '' });
const formData = ref({ title: '', instructions: '' });
const showEditNavigation = ref(false);
const combinedData = ref({});


// Manejar la actualización del objeto questions
const handleQuestionsUpdate = (questions: Question[]) => {
    combinedData.value = {
        ...combinedData.value,
        ...formData.value,
        questions: questions,
    };
};

const handleFileSelected = (file: string) => {
    combinedData.value = {
        ...formData.value,
        cover: file,
    };
};

const handleVideoSelected = (video_file: string) => {
    combinedData.value = {
        ...formData.value,
        video_file: video_file,
    };
};

// Modify the watch for currentModal
watch(() => currentModal.value.label, (newLabel, oldLabel) => {
    // Remove previous listeners
    if (oldLabel) {
        EventBus.off('questionsUpdated');
        EventBus.off('file-selected');
    }

    // Add new listeners based on modal type
    if (newLabel === 'Layout block') {
        EventBus.on('questionsUpdated', handleQuestionsUpdate);
        EventBus.on('file-selected', handleFileSelected);
    } else if (newLabel === 'Video layout') {
        EventBus.on('file-selected', handleVideoSelected);
    }
}, { immediate: true });

// Remove handleSave from onMounted


const handleSave = () => {
    if (currentModal.value.label === 'Layout block') {
        if (!combinedData.value.questions || combinedData.value.questions.length === 0) {
            console.warn('No questions data available');
            return;
        }
        console.log('Saving task:', toRaw(combinedData.value));
        tasksStore.saveTask(combinedData.value);
    } else if (currentModal.value.label === 'Video layout') {
        if (!combinedData.value.video_file) {
            console.warn('No video data available');
            return;
        }
        console.log('Saving video:', toRaw(combinedData.value));
    }

    // Reset forms after saving
    formData.value = { title: '', instructions: '' };
    combinedData.value = {};
    closeModal();
};

// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };

    openModal();  // Asegúrate de abrir el modal
};

</script>