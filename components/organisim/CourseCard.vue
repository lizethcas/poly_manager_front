<template>
  <p v-if="coursesData.length === 0" class="text-title-color">
    there are no courses yet
  </p>
  <div
    v-if="coursesData && coursesData.length > 0"
    v-for="course in coursesData.slice().reverse()"
    :key="course.id"
    @click="navigateToCourse(course.id)"
    class="w-full flex flex-row gap-2 md:gap-0 max-[480px]:flex-col bg-white border rounded-md cursor-pointer mt-4 hover:scale-105 transition-all duration-300 p-2"
  >
    <!-- Course Image -->
    <div class="rounded-md self-center md:self-auto">
      <img
        v-if="course.cover"
        :src="getCoverUrl(course.cover)"
        alt=""
        class="rounded-md object-cover h-20 w-20"
      />
    </div>

    <!-- Course Info -->

    <div class="flex flex-col md:mt-0 md:ml-4 flex-grow justify-between">
      <div class="flex items-center gap-2">
        <h2
          class="text-fuscous-gray-600 font-bold text-base md:text-lg w-contain"
        >
          {{ course.name }}
        </h2>
        <!-- Level Badge -->
      </div>

      <div
        class="flex md:items-center md:gap-4 mt-1 flex-wrap"
        @click="(event) => publishCourse(course.id, event)"
      >
        <div
          v-show="course.publish"
          class="bg-emerald-100 text-emerald-700 text-xs px-2 rounded-full flex items-center gap-1"
        >
          <IconMolecule
            :name="IconType.eye"
            :size="16"
            :color="'text-emerald-700'"
          />
          <span class="leading-none">published</span>
        </div>
        <div
          v-show="!course.publish"
          class="text-xs px-2 rounded-full flex items-center gap-1 bg-white border border-fuscous-gray-600"
        >
          <IconMolecule
            :name="IconType.eyeOff"
            :size="16"
            :color="'text-fuscous-gray-600'"
          />
          <span class="leading-none">hidden</span>
        </div>
        <!-- Modified stats section with responsive classes -->
        <div
          class="flex items-center gap-1 md:gap-2 text-gray-600 text-xs flex-wrap"
        >
          <span
            class="flex items-center gap-1"
            @click="handleStudents(course.id)"
          >
            <IconMolecule
              :name="IconType.students"
              :size="16"
              :color="'text-gray-600'"
            />
            {{
              useCourseStudents(course.id).students?.value?.data
                .total_students || 0
            }}
            students
          </span>
          <span class="flex items-center gap-1">
            <IconMolecule
              :name="IconType.collection"
              :size="16"
              :color="'text-gray-600'"
            />
            {{ classes }}
            {{ classes === 1 ? "lesson" : "lessons" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col justify-between text-center">
      <div class="flex items-center gap-2">
        <span
          :class="[
            getLevelColor(course.level, true),
            'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
          ]"
        >
          {{ course.level.split(".")[0] }}
        </span>
        <!-- Course Type -->
        <span
          :class="[
            getLevelColor(course.level, true),
            'text-xs font-semibold px-1 py-1 rounded-full text-fuscous-gray-950',
          ]"
          >{{ course.category }}</span
        >
      </div>
      <div class="text-xs flex items-center gap-2">
        <button
          class="text-blue-500 px-4 py-1 rounded-full border border-blue-500"
        >
          preview
        </button>
        <button
          @click.stop="openEditModal(course)"
          class="text-blue-500 px-4 py-1 rounded-full border border-blue-500 text-xs"
        >
          edit
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center"
  >
    <div class="w-full max-w-5xl mx-auto">
      <AddCourseModal
        :title="createCourse.title"
        :type="createCourse.type"
        @closeModal="closeModal"
        :showExtraElements="true"
        @handleSave="handleCourseAction"
        :initialData="selectedCourse"
        :actionType="'edit'"
        :deleteAction="true"
        @handleDelete="handleDelete"
      />
    </div>
  </div>
  <div
    v-if="confirmDelete"
    class="fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-50 bg-gray-600 bg-opacity-90 h-screen"
  >
    <UAlert
      class="w-full max-w-xl mx-auto"
      :actions="[
        {
          variant: 'solid',
          color: 'red',
          label: 'Delete',
          click: () => confirmDeleteCourse(),
        },
        {
          variant: 'outline',
          color: 'gray',
          label: 'Cancel',
          click: () => (confirmDelete = false),
        },
      ]"
      title="Delete Course"
      description="Are you sure you want to delete this course? This action cannot be undone."
    />
  </div>
</template>

<script lang="ts" setup>
import { createCourse } from "~/data/cardModal";

import AddCourseModal from "./AddCourseModal.vue";
import IconMolecule from "~/components/atomos/Icon.vue";
import { useGetColor } from "~/composables/useGetColor";
import { useGetCover } from "~/composables/useGetcover";
import { useTaskStore } from "~/stores/task.store";
import { IconType } from "~/data/iconsType";
import { routes } from "~/data/routes";
import { ref } from "vue";
import { useModal } from "~/composables/useModal";
import { useCourseMutation } from "~/composables/useCourseMutation";
import { useCourseStudents } from "~/composables/useCourseStudents";

// Updated Props interface with proper typing
interface Course {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  cover?: string;
  students?: number;
  publish?: boolean;
}

interface Props {
  coursesData?: Course[];
}

const props = defineProps<Props>();
const { isOpen, openModal, closeModal } = useModal();
const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();
const taskStore = useTaskStore();
const classes = taskStore.getTask("classes");

const activeDropdown = ref<number | null>(null);

// Add these new refs and emits
const selectedCourse = ref<Course | null>(null);
const confirmDelete = ref(false);
const emit = defineEmits(["openModal"]);
const { updateCourseMutation, deleteCourseMutation } = useCourseMutation();

const handleStudents = (courseId: number) => {
  console.log(courseId);
};

// Improved click outside handler

onMounted(() => {
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative")) {
      activeDropdown.value = null;
    }
  });
});

const navigateToCourse = (courseId: number) => {
  // Verificar que el ID existe antes de navegar
  const course = props.coursesData?.find((c) => c.id === courseId);
  if (course) {
    navigateTo(routes.routesAdmin.classes(courseId.toString()));
  } else {
    console.error("Curso no encontrado");
  }
};

// Update the handleCourseAction function
const handleCourseAction = async (formData: any) => {
  if (!selectedCourse.value?.id) return;

  const formDataToSend = new FormData();

  // Add non-file fields to FormData
  Object.entries(formData.formData).forEach(([key, value]) => {
    if (key === "cover") return;

    if (value !== undefined && value !== null && value !== "") {
      formDataToSend.append(key, value as string);
    }
  });

  // Handle cover file
  if (formData.formData.cover instanceof File) {
    formDataToSend.append("cover", formData.formData.cover);
  }

  // Add bullet points
  if (formData.bulletPoints?.length > 0) {
    formDataToSend.append(
      "bullet_points",
      JSON.stringify(formData.bulletPoints)
    );
  }

  // Add stats to FormData
  formDataToSend.append("stats", formData.formData.stats);

  await updateCourseMutation.mutateAsync({
    id: selectedCourse.value.id,
    formData: formDataToSend,
  });

  closeModal();
};

// Modify the openEditModal function
const openEditModal = (course: Course) => {
  // Transform the course data to match the form structure
  selectedCourse.value = {
    ...course,
    name: course.name,
    description: course.description,
    category: course.category,
    level: course.level,
    cover: course.cover,
  };

  openModal();
};

const handleDelete = async () => {
  if (!selectedCourse.value?.id) return;
  confirmDelete.value = true;
  
};

const confirmDeleteCourse = async () => {
  if (!selectedCourse.value?.id) return;
  try {
    await deleteCourseMutation.mutateAsync(selectedCourse.value.id);
    confirmDelete.value = false;
    closeModal();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

const publishCourse = async (courseId: number, event: Event) => {
  event.stopPropagation(); // Prevent navigation when clicking publish/hidden
  const course = props.coursesData?.find((c) => c.id === courseId);
  if (!course) return;

  const formData = new FormData();
  formData.append("publish", (!course.publish).toString());

  try {
    await updateCourseMutation.mutateAsync({
      id: courseId,
      formData: formData,
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
  }
};
</script>
