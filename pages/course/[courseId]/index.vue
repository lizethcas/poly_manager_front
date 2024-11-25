<template>
  <main class="py-10 px-14 text-title-color mb-6">
    <SearchInput />
    <div class="flex items-center my-5 text-middele-gray">
      <p class="mr-4">total lessons</p>
      <div class="flex-grow border-t-2 border-dotted border-middele-gray"></div>
    </div>


    <NuxtLink :to="`/course/class/1/create-class`" class="hover:text-blue-500">class</NuxtLink>
    <!-- Course overview content -->
    <AddCourseButton @handleAdd="handleAdd" :text="createClass.buttonText" />
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-gray-600 bg-opacity-50 overflow-y-auto">
      <div class="min-h-screen flex items-center justify-center">
        <div class="w-full max-w-5xl m-auto p-5">
          <AddCourseModal :title="createClass.title" @closeModal="closeModal" :showExtraElements="false" />
        </div>
      </div>
    </div>

  </main>
</template>
<script setup lang="ts">
import AddCourseModal from '~/components/organisim/AddCourseModal.vue';
import { useModal } from '~/composables/useModal';
import { createClass } from '~/data/cardModal';
import { useRoute } from 'vue-router';
import { findItem } from '~/utils/findItem.utils';
import { useCourseStore } from '~/stores/courseStore';
const route = useRoute();
const courseId = route.params.courseId as string;
const courseStore = useCourseStore();
const course = findItem(courseId, toRaw(courseStore.courses)); // Replace 'items' with your actual array

const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
  openModal();
}
</script>