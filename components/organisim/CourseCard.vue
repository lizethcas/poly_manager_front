<template>
  <div v-if="courses.length > 0" v-for="course in courses.slice().reverse()" @click="navigateTo(`/course/${course.id}`)"
    :class="[
      'flex justify-between border-2 rounded-xl cursor-pointer mt-4',
      getLevelColor(course.level) // Aplica el color de borde
    ]">
    <div class="flex w-1/2 my-4">
      <div :class="['rounded-full w-14 h-14 flex items-center justify-center mx-4', getLevelColor(course.level)]">
        <p class="text-xl font-bold" v-if="course.level">{{ course.level.split(".")[0] }}</p>
      </div>
      <div>
        <h3 v-if="course.level" class="text-xl font-bold" :class="getLevelColor(course.level)">
          {{ course.level.split(' ').length > 1 
              ? (course.level.split(' ')[2] 
                  ? `${course.level.split(' ')[1]} ${course.level.split(' ')[2]}`
                  : course.level.split(' ')[1])
              : course.level.split(' ')[1] }}
        </h3>
        <h2 class="text-gray-high font-bold text-xl" v-if="course.course_name">{{ course.course_name }}</h2>
        <div class="flex items-center w-10/12 justify-between mt-4">
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2">published</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2">2</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2">45</p>
        </div>
      </div>
    </div>
    <div>
      <img v-if="course.cover" :src="getCoverUrl(course.cover)" alt="" class="rounded-[14px] w-36 h-auto" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCourseStore } from '~/stores/courseStore';
import { ApiService } from '~/services/create.course.api';
import type { CourseForm } from '~/interfaces/modal.interface';
import { ref } from 'vue';
const courseStore = useCourseStore();
const courses = ref(courseStore.courses);

const fetchCourses = async () => {

  try {
    const apiService = new ApiService();
    const fetchedCourses = await apiService.getAllCourses();
    courses.value = fetchedCourses as CourseForm[];
    courseStore.setCourses(fetchedCourses as CourseForm[]);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};

const getCoverUrl = (cover: string | File) => {
  if (typeof cover === 'string') return cover;
  return process.client ? URL.createObjectURL(cover) : '';
};

onMounted(() => {
  fetchCourses();

});

const getLevelColor = (level: string) => {
  if (level.includes("A0")) return "border-baby-steps-color text-baby-steps-color";
  if (level.includes("A1")) return "border-elementary-color text-elementary-color";
  if (level.includes("A2")) return "border-pre-intermediate-color text-pre-intermediate-color";
  if (level.includes("B1")) return "border-intermediate-color text-intermediate-color";
  return "border-upper-intermediate-color text-upper-intermediate-color";
}

</script>