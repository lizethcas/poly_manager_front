<template>
  <p v-if="!coursesData" class="text-title-color">no hay cursos</p>
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
          {{ course.course_name }}
        </h2>
        <!-- Level Badge -->
      </div>

      <!-- Course Name -->

      <!-- Stats -->

      <div class="flex md:items-center md:gap-4 mt-1 flex-wrap">
        <div
          class="bg-emerald-100 text-emerald-700 text-xs px-2 rounded-full flex items-center gap-1"
        >
          <IconMolecule
            :name="IconType.eye"
            :size="16"
            :color="'text-emerald-700'"
          />
          <span class="leading-none">published</span>
        </div>
        <!-- Modified stats section with responsive classes -->
        <div
          class="flex items-center gap-1 md:gap-2 text-gray-600 text-xs flex-wrap"
        >
          <span class="flex items-center gap-1">
            <IconMolecule
              :name="IconType.students"
              :size="16"
              :color="'text-gray-600'"
            />
            {{ course.students || 25 }} students
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
</template>

<script lang="ts" setup>
import IconMolecule from "~/components/atomos/Icon.vue";
import { useGetColor } from "~/composables/useGetColor";
import { useGetCover } from "~/composables/useGetcover";
import { useTaskStore } from "~/stores/task.store";
import { IconType } from "~/data/iconsType";
import { routes } from '~/data/routes'
import { ref } from 'vue';

// Updated Props interface with proper typing
interface Course {
  id: number;
  course_name: string;
  description: string;
  category: string;
  level: string;
  cover?: string;
  students?: number;
}

interface Props {
  coursesData?: Course[];
}

const props = defineProps<Props>();

const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();
const taskStore = useTaskStore();
const classes = taskStore.getTask("classes");
const activeDropdown = ref<number | null>(null);

// Add these new refs and emits
const showEditModal = ref(false);
const selectedCourse = ref<Course | null>(null);
const emit = defineEmits(['openModal']);

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

// Add this new method
const openEditModal = (course: Course) => {
  selectedCourse.value = course;
  emit('openModal', {
    course,
    mode: 'edit'
  });
};
</script>
