<template>
    <header class="pt-20 px-14 text-title-color mb-24">
        <h1 class="text-xl font-bold mb-6">{{ homeData.title }}</h1>
        <v-divider class="border-opacity-100" color="success"></v-divider>
        <SearchInput />
        <h2 class="mt-4 font-bold text-m ">{{ homeData.subTitle }}</h2>
        <AddCourse />

    </header>

</template>

<script lang="ts" setup>
import AddCourse from '~/components/AddCourseButton.vue';
import homeData from '~/data/home.data';


</script>
