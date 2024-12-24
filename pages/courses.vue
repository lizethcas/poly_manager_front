<template>
  <div class="w-full" v-if="userType === 'teacher'">
    <header class="pt-10 px-14 text-title-color mb-4 m-auto">
      <SearchInput />
      <UDivider class=" border-gray-500 py-6" type="solid"></UDivider>


      <h2 class="mt-4 font-bold text-m ">{{ homeData.subTitle }}</h2>
      <AddCourseButton @handleAdd="handleAdd" :text="createCourse.buttonText" />
    </header>
    <main class="px-14 w-4/5 text-title-color mb-24 flex flex-wrap items-center justify-evenly">
      <div v-if="isOpen"
        class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start overflow-y-auto">
        <div class="w-full max-w-5xl m-auto p-5">
          <AddCourseModal :title="createCourse.title" @closeModal="closeModal" :showExtraElements="true" />
        </div>
      </div>

      <Error v-if="error" :error="error" :message="error.message" @refetch="refetch" />
      <Loading v-else-if="isLoading" />
      <OrganismCourseCard v-else-if="courses" :courses-data="courses" />
    </main>
  </div>

  <!-- Student View -->
  <div v-else class="container mx-auto px-4">
    <Error v-if="error" :error="error" :message="error.message" @refetch="refetch" />
    <Loading v-if="isLoading" />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      
      <CourseCardStudent
        v-for="course in courses"
        :key="course.id"
        :course="{
          imageUrl: course.imageUrl,
          type: course.type,
          level: course.level,
          levelName: course.levelName,
          title: course.title,
          description: course.description,
          lessonCount: course.lessonCount,
          id: course.id
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModal } from '../composables/useModal';
import { createCourse } from '~/data/cardModal';
import homeData from '~/data/home.data';
import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
import OrganismCourseCard from '~/components/organisim/CourseCard.vue';
import Loading from '~/components/organisim/alerts/Loading.vue';
import Error from '~/components/organisim/alerts/Error.vue';
import CourseCardStudent from '~/components/organisim/templatesUsers/students/CourseCardStudent.vue';
import { useTaskStore } from '~/stores/task.store';
import { useCoursesQuery } from '~/composables/useCourseQuery';

const taskStore = useTaskStore()
const userType = computed(() => taskStore.getTask('userType'))

const { isOpen, openModal, closeModal } = useModal();

// Use the courseQuery composable
const {
  data: courses,
  isLoading,
  error,
  refetch
} = useCoursesQuery();

const handleAdd = () => {
  openModal();
}
</script>
