<template>
    <header class="pt-20 px-14 text-title-color mb-15">
        <h1 class="text-xl font-bold mb-4">{{ homeData.title }}</h1>
        <UDivider class=" border-gray-500 py-6" type="solid"></UDivider>

        <SearchInput />
        <h2 class="mt-4 font-bold text-m ">{{ homeData.subTitle }}</h2>
        <AddCourseButton @handleAdd="handleAdd" />
    </header>
    <main class=" px-14 text-title-color mb-24">
        <div v-if="isOpen"
            class="absolute inset-0 w-screen h-screen bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
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

const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
    openModal();
}
</script>
