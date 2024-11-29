<template>
    <header class="pt-20 px-14 text-title-color mb-4">
        <h1 class="text-xl font-bold mb-4">{{ homeData.title }}</h1>
        <UDivider class=" border-gray-500 py-6" type="solid"></UDivider>

        <SearchInput />
        <h2 class="mt-4 font-bold text-m ">{{ homeData.subTitle }}</h2>
        <AddCourseButton @handleAdd="handleAdd" :text="createCourse.buttonText" />
    </header>
    <main class=" px-14 text-title-color mb-24 flex flex-wrap items-center justify-center">
        <div v-if="isOpen"
            class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start  overflow-y-auto">
            <div class="w-full max-w-5xl m-auto p-5">
                <AddCourseModal :title="createCourse.title" @closeModal="closeModal" :showExtraElements="true" />
            </div>
        </div>
        <OrganismCourseCard />
    
    </main>


</template>

<script lang="ts" setup>
import { useModal } from '../composables/useModal';
import { createCourse } from '~/data/cardModal';
import homeData from '~/data/home.data';
import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
import OrganismCourseCard from '~/components/organisim/CourseCard.vue';
import { useCourseStore } from '~/stores/courseStore.js';
const courseStore = useCourseStore();
console.log(toRaw(courseStore.currentForm))
const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
    openModal();
}
</script>
