<template>
  
  <div class="md:w-4/5 px-4 w-full" v-if="userType === 'teacher'">
    
    
    <header class="text-title-color mb-4 ">
      <h2 class=" font-bold text-m text-fuscous-gray-600">{{ homeData.subTitle }}</h2>
      <AddCourseButton @handleAdd="handleAdd" :text="createCourse.buttonText" />
    </header>
    <main
      class="w-full  text-title-color mb-24 flex flex-wrap items-center justify-evenly"
    >
      <div
        v-if="isOpen"
        class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start overflow-y-auto z-50"
      >
        <div class="w-full max-w-5xl m-auto p-5">
          <AddCourseModal
            :title="createCourse.title"
            @closeModal="closeModal"
            :showExtraElements="true"
          />
        </div>
      </div>

      <Error
        v-if="error"
        :error="error"
        :message="error.message"
        @refetch="refetch"
      />
      <Loading v-else-if="isLoading" />
      <OrganismCourseCard v-else-if="courses" :courses-data="courses" />
    </main>
  </div>

  <!-- Student View -->

  <template v-else>
    <CourseCardStudent :courses="courses" />
  </template>
</template>

<script lang="ts" setup>
import { useModal } from "../composables/useModal";
import { createCourse } from "~/data/cardModal";
import homeData from "~/data/home.data";
import AddCourseModal from "~/components/organisim/AddCourseModal.vue";
import OrganismCourseCard from "~/components/organisim/CourseCard.vue";
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import { useTaskStore } from "~/stores/task.store";
import { useCoursesQuery } from "~/composables/useCourseQuery";

const taskStore = useTaskStore();
const userType = computed(() => taskStore.getTask("userType"));

const { isOpen, openModal, closeModal } = useModal();

// Use the courseQuery composable
const { data: courses, isLoading, error, refetch } = useCoursesQuery();

const handleAdd = () => {
  openModal();
};
</script>
