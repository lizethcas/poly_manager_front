<template>
    <div class="w-full" v-if="userType === 'teacher'">
        <header class="pt-20 px-14 text-title-color mb-4 m-auto">
            <h1 class="text-xl font-bold">{{ homeData.title }}</h1>
            <UDivider class=" border-gray-500 py-6" type="solid"></UDivider>

            <SearchInput />
            <h2 class="mt-4 font-bold text-m ">{{ homeData.subTitle }}</h2>
            <AddCourseButton @handleAdd="handleAdd" :text="createCourse.buttonText" />
        </header>
        <main class=" px-14 w-4/5 text-title-color mb-24 flex flex-wrap items-center justify-evenly">
            <div v-if="isOpen"
                class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start  overflow-y-auto">
                <div class="w-full max-w-5xl m-auto p-5">
                    <AddCourseModal :title="createCourse.title" @closeModal="closeModal" :showExtraElements="true" />
                </div>
            </div>
            
            <!-- Loading state -->
            <div v-if="isLoading" class="text-title-color">Loading...</div>
            
            <!-- Error state -->
            <div v-if="error" class="text-title-color">Error: {{ error.message }}</div>
            
            <!-- Data display -->
            <OrganismCourseCard :courses-data="courses" />
        </main>
    </div>
    <div v-else>
        <OrganisimTemplatesStudentsCoursesEstudents />
    </div>
</template>

<script lang="ts" setup>
import { useModal } from '../composables/useModal';
import { createCourse } from '~/data/cardModal';
import homeData from '~/data/home.data';
import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
import OrganismCourseCard from '~/components/organisim/CourseCard.vue';
import { useTaskStore } from '~/stores/task.store';
import { useQuery } from '@tanstack/vue-query';
import { apiRoutes, get } from '@/services/routes.api';

const taskStore = useTaskStore()
const userType = computed(() => taskStore.getTask('userType'))

const { isOpen, openModal, closeModal } = useModal();

// Define the fetch function
const fetchCourses = async () => {
  try {
    const response = await get(apiRoutes.courses)
    console.log('Courses data:', response)
    return response
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

// Use Vue Query hook
const { data: courses, isLoading, error } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
  staleTime: 0
})

const handleAdd = () => {
    openModal();
}
</script>
