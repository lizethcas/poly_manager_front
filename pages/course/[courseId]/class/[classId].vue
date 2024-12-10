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
const isActive = ref(false);
const showEditNavigation = ref(false);
const combinedData = ref({});


// Manejar la actualización del objeto questions
const handleQuestionsUpdate = (questions: Question[]) => {
    combinedData.value = {
        ...formData.value,
        questions: toRaw(questions),
        video_file: '',
    };
};

// Escuchar el evento cuando el componente se monta
onMounted(() => {
    EventBus.on('questionsUpdated', handleQuestionsUpdate);
    handleSave();
});

// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };

    openModal();  // Asegúrate de abrir el modal
};


const handleSave = () => {

    if (currentModal.value.label === 'Video layout') {
        console.log('videoData', videoData.value);
        return;
    }

    if (currentModal.value.label === 'Layout block') {
        if (Object.keys(toRaw(combinedData.value)).length === 0) {
            isActive.value = false;
            console.log('El objeto combinedData está vacío');
            return;
        } else {
            console.log(toRaw(combinedData.value));
            tasksStore.saveTask(combinedData.value);
            formData.value = {
                title: '',
                instructions: '',
            };
            combinedData.value = {
                title: '',
                instructions: '',
                questions: [] as Question[],
            };

        }

    }

    closeModal();

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
} */

}
</script>