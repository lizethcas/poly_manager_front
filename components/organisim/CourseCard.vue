<template>
  <p v-if="!courses" class="text-title-color">cargando</p>
  <div v-if="courses.length > 0" v-for="course in courses.slice().reverse()" :key="course.id"
    @click="navigateToCourse(course.id)" :class="[
      'w-full flex justify-between border-2 rounded-xl cursor-pointer mt-4 hover:scale-105 transition-all duration-300',
      getLevelColor(course.level) // Aplica el color de borde
    ]">
    <div class="flex w-1/2 mt-2">
      <div :class="['rounded-full w-14 h-14 flex items-center  ml-4', getLevelColor(course.level)]">
        <p :class="[
          'text-md font-bold rounded-full px-2 py-1', // Clases comunes
          getLevelColor(course.level, true) // Clases dinámicas solo para el fondo
        ]" v-if="course.level">
          {{ course.level.split(".")[0] }}
        </p>
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex flex-col">
          <h3 v-if="course.level" class="text-md font-bold" :class="getLevelColor(course.level)">
            {{ course.level.split(' ').length > 1
              ? (course.level.split(' ')[2]
                ? `${course.level.split(' ')[1]} ${course.level.split(' ')[2]}`
                : course.level.split(' ')[1])
              : course.level.split(' ')[1] }}
          </h3>
          <h2 class="text-gray-high font-bold text-md" v-if="course.course_name">{{ course.course_name }}</h2>
        </div>
        <div class="flex items-center w-fit justify-between mb-2 gap-2">
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2 text-xs">publisheds</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2 text-xs">2</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2 text-xs">45</p>
        </div>
      </div>
    </div>
    <div class="rounded-xl ">
      <img v-if="course.cover" :src="getCoverUrl(course.cover)" alt="" class="rounded-xl object-cover w-28 h-28 m-1" />
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useCourseStore } from '~/stores/courseStore';
import { useGetColor } from '~/composables/useGetColor';
/* import { ApiService } from '~/services/create.course.api';
import type { CourseForm } from '~/interfaces/modal.interface'; */
import { useGetCover } from '~/composables/useGetcover';
const courseStore = useCourseStore();
console.log(courseStore.courses)
const courses = computed(() => courseStore.courses);

const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();


const navigateToCourse = (courseId: number) => {
  // Verificar que el ID existe antes de navegar
  const course = courseStore.courses.find(c => c.id === courseId);
  if (course) {
    navigateTo(`/course/${courseId}`);
  } else {
    console.error('Curso no encontrado');
  }
};

</script>
