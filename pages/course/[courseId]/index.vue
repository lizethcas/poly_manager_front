<template>
  <main class="px-14 text-title-color mb-24">
    <SearchInput />
    <!-- Course overview content -->
    <AddCourseButton @handleAdd="handleAdd" />
    <div v-if="isOpen"
      class="absolute inset-0 w-screen h-screen bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div class="w-full max-w-5xl m-auto p-5">
        <AddCourseModal :title="createCourse.title" @closeModal="closeModal" :showExtraElements="false" />
      </div>
    </div>
    <!-- Add your overview content here -->
  </main>
</template>
<script setup lang="ts">
import { useModal } from '~/composables/useModal';

const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
  openModal();
}
</script>