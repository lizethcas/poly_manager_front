<template>
    <div class="w-full">
        <div v-if="classes.length === 0"
            class="font-bold flex justify-center items-center text-center h-screen text-fuscous-gray-950 text-xl ">
            There are no classes created for this course yet.
        </div>

        <EditClassNavigation @open-modal="openModalHandler" />
        <div v-if="isOpen">
            <BaseTaskModal :is-open="isOpen" @close="closeModal" :title="currentModal.label" :icon="currentModal.name">
                <div>
                    <InputFile v-model="formData.cover" @file-selected="handleCoverImage" fileType="image" />
                </div>
            </BaseTaskModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';

const { isOpen, openModal, closeModal } = useModal();
const currentModal = ref({ label: '', name: '' });
const classes = ref([]);
const formData = ref({ cover: null });

const handleCoverImage = (file: File) => {
    formData.value.cover = file;
};

// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };
    console.log(name)
    openModal();  // Asegúrate de abrir el modal
};
</script>