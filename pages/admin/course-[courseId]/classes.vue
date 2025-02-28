<template>
  <div class="text-title-color mb-6">
    <div class="flex items-center text-middele-gray w-4/5">
      <p class="mr-4">total lessons {{ filteredData?.length || 0 }}</p>
      <div class="flex-grow border-t-2 border-dotted border-middele-gray"></div>
    </div>

    <!-- Show loading state -->
    <div v-if="isLoading">Loading...</div>

    <!-- Show error state -->
    <div v-else-if="classesError">Error: {{ classesError.message }}</div>

    <!-- Show data -->
    <div class="bg-white rounded-lg p-4 mb-2 shadow-sm relative w-full">
      <ClassCard
        v-if="filteredData && filteredData.length > 0"
        :classes="filteredData"
        :showDragIcon="true"
      />
      <div v-else class="text-center text-md text-middele-gray">
        No classes created yet
      </div>
    </div>

    <AddCourseButton @handleAdd="handleAdd" :text="createClass.buttonText" />
    <div
      v-if="isOpen"
      class="fixed inset-0 w-full h-full bg-gray-600 bg-opacity-50 overflow-y-auto z-50"
    >
      <div class="min-h-screen flex items-center justify-center">
        <div class="w-full max-w-5xl m-auto p-5">
          <AddCourseModal
            :title="createClass.title"
            @closeModal="handleCloseModal"
            @handleSave="handleSave"
            :showExtraElements="false"
         
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});
import AddCourseModal from "~/components/organisim/AddCourseModal.vue";
import ClassCard from "~/components/organisim/ClassCard.vue";
import { useModal } from "~/composables/useModal";
import { createClass } from "~/data/cardModal";
import { useClassesQuery } from "~/composables/useClassesQuery";
import { useClassMutation } from "~/composables/useClassMutation";
import { useNotify } from "~/composables/useNotify";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const classMutation = useClassMutation();

const courseId = 1;

const { success, error } = useNotify();
const {
  data,
  error: classesError,
  isLoading,
  refetch: refresh,
} = useClassesQuery(courseId as string);


const filteredData = computed(() => {
  return data.value?.filter((item: any) => item.course_id == courseId) || [];
});
console.log(filteredData.value);
const { isOpen, openModal, closeModal } = useModal();

const handleAdd = () => {
  openModal();
};

const handleCloseModal = async () => {
  closeModal();
  await refresh();
};

const handleSave = async (formDataEvent: any) => {
  try {
    const { formData, bulletPoints } = formDataEvent;

    const requestData = {
      name: formData.name,
      description: formData.description,
      course_id: courseId,
      bullet_points: JSON.stringify(bulletPoints),
      cover: formData.cover,
      publish: formData.publish,
    };
    await classMutation.createClassMutation.mutateAsync(requestData);
    success("Class created successfully");
    await handleCloseModal();

  } catch (err) {
    console.error("Error creating class:", err);
    error("Failed to create class");
  }
};
</script>
