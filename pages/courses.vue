<template>
  <div class="w-full" v-if="userType === 'teacher'">
    <header class="pt-10 px-14 text-title-color mb-4 m-auto">
      <SearchInput />
      <UDivider class=" border-gray-500 py-6" type="solid"></UDivider>


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

      <!-- Error state -->

      <Error v-if="error" :error="error" :message="error.message" @refetch="refetch" />


      <!-- Loading state -->
      <Loading v-else-if="isLoading" />

      <!-- Data display -->
      <OrganismCourseCard v-else-if="courses" :courses-data="courses" />
    </main>
  </div>
  

  <!-- Error state -->


  <!-- Loading state -->
  

  <!-- Data display -->

  <OrganisimTemplatesUsersStudentsCoursesEstudents v-else/>
</template>

<script lang="ts" setup>
import { useModal } from '../composables/useModal';
import { createCourse } from '~/data/cardModal';
import homeData from '~/data/home.data';
import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
import OrganismCourseCard from '~/components/organisim/CourseCard.vue';
import Loading from '~/components/organisim/alerts/Loading.vue';
import Error from '~/components/organisim/alerts/Error.vue';
import { useTaskStore } from '~/stores/task.store';
import { useQuery } from '@tanstack/vue-query';
import { apiRoutes, get } from '@/services/routes.api';

const taskStore = useTaskStore()
const userType = computed(() => taskStore.getTask('userType'))

const { isOpen, openModal, closeModal } = useModal();

// Update the fetch function with better error handling
const fetchCourses = async () => {
  try {
    const response = await get(apiRoutes.courses)
    if (!response) {
      throw new Error('No se encontraron datos')
    }
    return response
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Error al cargar los cursos'
    )
  }
}

// Use Vue Query hook with error handling
const {
  data: courses,
  isLoading,
  error,
  refetch
} = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
  staleTime: 0,
  retry: 1, // Limit retry attempts
})

const handleAdd = () => {
  openModal();
}
</script>
