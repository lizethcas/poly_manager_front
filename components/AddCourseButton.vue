<template>

    <div class="rounded-lg  w-full border-fresh-green border-2 text-center mt-2 p-3 ">
        <button class="flex flex-col items-center justify-center cursor-pointer w-fit m-auto" @click="openModal"
            aria-label="Agregar nuevo curso">
            <img src="../assets/images/add.webp" alt="Ícono para agregar un nuevo curso" role="img" />
            <p class="text-fresh-green pt-2">{{ homeData.buttom }}</p>
        </button>
    </div>

    <div v-if="isOpen"
        class="absolute inset-0 w-screen h-screen bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
        <div class="w-full max-w-5xl m-auto p-5">
            <AddCourseModal :title="createCourse.title" @closeModal="closeModal" :showExtraElements="true" />
        </div>
    </div>
  

</template>

<script lang="ts" setup>
import homeData from '~/data/home.data';
import {  createCourse } from '~/data/cardModal';
const isOpen = ref(false)

const openModal = () => {
    isOpen.value = true;
};

const closeModal = () => {
    isOpen.value = false;
};

</script>