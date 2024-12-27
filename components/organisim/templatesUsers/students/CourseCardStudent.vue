<template>
  <p v-if="!courses" class="text-title-color">no hay cursos</p>
  <div
    v-if="courses"
    v-for="course in courses"
    :key="course.id"
    @click="navigateToCourse(course.id)"
    class="w-4/5 flex bg-white border rounded-xl cursor-pointer mt-2  transition-all duration-300 p-2"
  >
    <!-- Move "My Current Course" to the top -->
    <div class="flex flex-col w-full p-1">
      <div class="flex justify-between"  v-show="route.path.includes('/course-students')">
        <h2
          class="text-fuscous-gray-600 font-bold text-lg mb-2 w-contain"
          
        >
          My Current Course:
        </h2>
        <div class="flex items-center gap-2 text-sm">
          <p class="text-fuscous-gray-600">Unhide finished classes</p>
          <AtomosToggle />
        </div>
      </div>
      <div class="flex">
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
          <div class="items-center gap-2">
            <h3 class="text-fuscous-gray-600 font-bold text-lg">
              {{ course.course_name }}
            </h3>
            <!-- Level Badge -->
          </div>

          <NuxtLink
            v-if="!route.path.includes('/course-students')"
            :to="`/course-students/${course.id}`"
            class="text-blue-500 border-blue-500 text-xs hover:underline"
          >
            View the course details
          </NuxtLink>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col justify-between"
          v-show="!route.path.includes('/course-students')"
        >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Course } from "~/interfaces/course.interface";
import { useGetCover } from "~/composables/useGetcover";
import { useGetColor } from "~/composables/useGetColor";

const route = useRoute();

const { getCoverUrl } = useGetCover();
const { getLevelColor } = useGetColor();
const navigateToCourse = (courseId: number) => {

  navigateTo(`/course-students/${courseId}`);
};

defineProps<{
  courses: Course[];
}>();


</script>
