<template>
    <main class="py-4  text-title-color mb-6 md:w-full  ">
      
      <div class="flex items-center  text-middele-gray w-4/5 ">
        <p class="mr-4">total lessons {{ filteredData?.length || 0 }}</p>
        <div class="flex-grow border-t-2 border-dotted border-middele-gray"></div>
      </div>
      
      <!-- Show loading state -->
      <div v-if="isLoading">Loading...</div>
      
      <!-- Show error state -->
      <div v-else-if="error">Error: {{ error.message }}</div>
      
      <!-- Show data -->
       <div class="bg-white rounded-lg p-4 mb-2 shadow-sm relative w-4/5">
        <ClassCard v-if="filteredData && filteredData.length > 0" :classes="filteredData" />
        <div v-else class="text-center text-md text-middele-gray">No classes created yet</div>
       </div>
      
      <AddCourseButton @handleAdd="handleAdd" :text="createClass.buttonText" />
      <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-gray-600 bg-opacity-50 overflow-y-auto">
        <div class="min-h-screen flex items-center justify-center relative z-50">
          <div class="w-full max-w-5xl m-auto p-5">
            <AddCourseModal :title="createClass.title" @closeModal="closeModal" :showExtraElements="false" />
          </div>
        </div>
      </div>
  
    </main>
  </template>
  <script setup lang="ts">
  import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
  import ClassCard from '~/components/organisim/ClassCard.vue';
  import { useModal } from '~/composables/useModal';
  import { createClass } from '~/data/cardModal';
  import { useClassesQuery } from '~/composables/useClassesQuery';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';

  const route = useRoute();
  const courseId = route.params.courseId;

  const { data, isLoading, error } = useClassesQuery(courseId as string);

  const filteredData = computed(() => {
    return data.value?.filter((item: any) => item.course_id == courseId) || [];
  });

  const { isOpen, openModal, closeModal } = useModal();
  
  const handleAdd = () => {
    openModal();
  }
  </script>