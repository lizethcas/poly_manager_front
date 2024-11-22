<template>
  <div v-if="courses.length > 0" v-for="course in courses.slice().reverse()"
    @click="navigateTo(`/course/${course.id}`)"
    class="flex justify-between border-fresh-green border-2 rounded-xl cursor-pointer my-4 ">
    <div class="flex  w-1/2 my-4">
      <div class="bg-green-high text-green-low  rounded-full w-14 h-14 flex items-center justify-center mx-4">
        <p class="text-xl font-bold">{{ course.level.split(".")[0] }}</p>
      </div>
      <div>
        <h3 class="text-xl font-bold text-green-low">{{ `${course.level.split(" ")[1]} ${course.level.split(" ")[2]}` }}
        </h3>
        <h2 class="text-gray-high font-bold text-xl">{{ course.course_name }}</h2>
        <div class=" flex items-center w-10/12 justify-between mt-4">
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2">published</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2">2</p>
          <p class="text-gray-high border-2 border-gray-light rounded-full px-2 ">45</p>
        </div>
      </div>
    </div>
    <div>
      <img :src="course.cover ?? undefined" alt="edit" class="rounded-[14px] w-36 h-auto" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useCourseStore } from '~/stores/courseStore';
import { ApiService } from '~/services/create.course.api';
import type { CourseForm } from '~/interfaces/modal.interface';
import { computed } from 'vue';
const courseStore = useCourseStore();
const courses = computed(() => courseStore.courses);

const fetchCourses = async () => {
  try {
    const apiService = new ApiService();
    const courses = await apiService.getAllCourses();
    console.log(courses)
    courseStore.setCourses(courses as CourseForm[]);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};

onMounted(() => {
  fetchCourses();

});

</script>