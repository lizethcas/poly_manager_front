<template>
    <div class="w-full">
        <div v-if="classes.length === 0"
            class="font-bold flex justify-center items-center text-center h-screen text-fuscous-gray-950 text-md ">

            <div>
                <p>There are no activities created for this course yet.</p>
                <button @click="showEditNavigation = true"
                    class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">Add
                    Block</button>
            </div>
        </div>
        <transition name="slide-up" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <EditClassNavigation v-if="showEditNavigation" @open-modal="openModalHandler" class="z-10" />
        </transition>
        <div v-if="isOpen">
            <BaseTaskModal :is-open="isOpen" @close="closeModal" :title="currentModal.label"
                class="max-h-[80vh]  overflow-y-auto" :icon="currentModal.name">
                <div>
                    <OrganisimLayoutBlock v-if="currentModal.label === 'Layout block'" />
                    <EditClassNavigation @open-modal="openModalHandler" />
                </div>
                <div class="flex items-center gap-2 py-4 text-sm">
                    <p>Include the stats</p>
                    <AtomosToggle />
                </div>
                <MoleculeActionButtons @handleSave="handleSave(currentModal.label)" @handleCancel="$emit('close')" />

            </BaseTaskModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';
import { useAnimation } from '~/composables/useAnimation';


const { isOpen, openModal, closeModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();
const currentModal = ref({ label: '', name: '' });
const classes = ref([]);
const showEditNavigation = ref(false);

// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };

    openModal();  // Asegúrate de abrir el modal
};


const handleSave = (title: string) => {
    switch (title) {
        case 'Layout block':
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
}
</script>