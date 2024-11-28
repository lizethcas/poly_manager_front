<template>
    <div class="w-full">
        <!-- <img src="~/assets/images/back-button-round.webp" alt="regresar una pagina" class="w-10 h-10 cursor-pointer"
              @click="navigateTo(`/course/${routeCourseId}`)"  /> -->

        <div v-if="classes.length === 0"
            class="font-bold flex justify-center items-center text-center h-screen text-fuscous-gray-950 text-xl ">

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
            </BaseTaskModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';
import { useRoute } from 'vue-router';


const { isOpen, openModal, closeModal } = useModal();
const currentModal = ref({ label: '', name: '' });
const classes = ref([]);
const showEditNavigation = ref(false);

// Escuchar el evento y pasar los valores recibidos
const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };
    console.log(currentModal.value.label)
    openModal();  // Asegúrate de abrir el modal
};

const beforeEnter = (el: Element) => {
    (el as HTMLElement).style.transform = 'translateY(100%)';
    (el as HTMLElement).style.transition = 'transform 0.5s ease';
};

const enter = (el: Element) => {
    (el as HTMLElement).offsetHeight;
    (el as HTMLElement).style.transform = 'translateY(0)';
};

const leave = (el: Element) => {
    (el as HTMLElement).style.transform = 'translateY(100%)';
};
</script>