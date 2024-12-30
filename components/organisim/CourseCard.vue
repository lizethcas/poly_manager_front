<template>
  <p v-if="!coursesData" class="text-title-color">no hay cursos</p>
  <div
    v-if="coursesData.length > 0"
    v-for="course in coursesData.slice().reverse()"
    :key="course.id"
    @click="navigateToCourse(course.id)"
    class="w-full flex bg-white border rounded-xl cursor-pointer mt-4 hover:scale-105 transition-all duration-300 p-2 "
  >
    <!-- Course Image -->
    <div class="rounded-xl">
      <img
        v-if="course.cover"
        :src="getCoverUrl(course.cover)"
        alt=""
        class="rounded-xl object-cover w-20 h-20"
      />
    </div>

    <!-- Course Info -->

    <div class="flex flex-col ml-4 flex-grow justify-between">
      <div class="flex items-center gap-2">
        <h2 class="text-fuscous-gray-600 font-bold text-base md:text-lg w-contain">
          {{ course.course_name }}
        </h2>
        <!-- Level Badge -->
      </div>

      <!-- Course Name -->

      <!-- Stats -->
      <div class="flex items-center md:gap-4 mt-1">
        <span
          class="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full"
          >published</span
        >
        <!-- Modified stats section with responsive classes -->
        <div class="hidden md:flex items-center gap-2 text-gray-600 text-xs">
          <span class="flex items-center">
            <i class="fas fa-user mr-1"></i>
            {{ course.students || 25 }} students
          </span>
          <span class="flex items-center">
            <i class="fas fa-book mr-1"></i> {{ course.lessons || 45 }} lessons
          </span>
        </div>
        <!-- Added dropdown menu for mobile -->
   
          <Icon
            @click.stop="toggleDropdown(course.id)"
            name="mynaui:dots-solid"
            size="30"
            class="md:hidden"
          />
       
        <div
          v-if="activeDropdown === course.id"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border"
        >
          <div class="px-4 py-2 text-xs text-gray-600">
            <div class="flex items-center mb-2">
              <i class="fas fa-user mr-1"></i>
              {{ course.students || 25 }} students
            </div>
            <div class="flex items-center">
              <i class="fas fa-book mr-1"></i>
              {{ course.lessons || 45 }} lessons
            </div>
          </div>
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
            'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
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
          class="text-blue-500 px-4 py-1 rounded-full border border-blue-500 text-xs"
        >
          edit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGetColor } from "~/composables/useGetColor";
import { useGetCover } from "~/composables/useGetcover";

// Define las props
interface Props {
  coursesData?: any[]; // Reemplaza 'any' con la interfaz correcta de tus cursos
}

const props = defineProps<Props>();

const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();

const activeDropdown = ref<number | null>(null);

const toggleDropdown = (courseId: number) => {
  activeDropdown.value = activeDropdown.value === courseId ? null : courseId;
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
    navigateTo(`/course/${courseId}`);
  } else {
    console.error("Curso no encontrado");
  }
};
</script>
