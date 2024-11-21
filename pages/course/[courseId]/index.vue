<template>
  <main class="px-14 text-title-color mb-24">
    <SearchInput />
    <!-- Course overview content -->
    <AddCourseButton @handleAdd="handleAdd" :text="createClass.buttonText" />
    <div v-if="isOpen"
      class="fixed inset-0 w-full h-full bg-gray-600 bg-opacity-50 overflow-y-auto">
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

const route = useRoute();



const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
  openModal();
}
</script>