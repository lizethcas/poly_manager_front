<template>

    <header v-if="course" class="pt-20 px-14 text-title-color mb-15 flex">
        <img src="../../assets/images/back-button-round.webp" alt="regresar una pagina" class="w-10 h-10 cursor-pointer"
            @click="navigateTo('/')" />


        <img :src="course.cover" :alt="course.course_name" class="w-52 h-44 object-contain" />

        <div>
            <h2 class="text-black font-bold text-2xl">{{ course.course_name }}</h2>
            <div class="flex items-center">
                <div class="bg-green-high text-green-low  rounded-full w-14 h-8 flex items-center justify-center ">
                    <p class="text-s font-bold mx-4">{{ course.level.split(".")[0] }}</p>
                </div>
                <h3 class="text-m font-bold text-green-low mx-4">{{ `${course.level.split(" ")[1]}
                    ${course.level.split("")[2]}` }}
                </h3>
            </div>

            <div class=" flex items-center w-10/12 justify-between mt-4">
                <p class="text-gray-high border-2 border-gray-light rounded-full px-2">published</p>
                <p class="text-gray-high border-2 border-gray-light rounded-full px-2">2</p>
                <p class="text-gray-high border-2 border-gray-light rounded-full px-2 ">45</p>
            </div>
        </div>


    </header>
    <main>
        <!-- Navigation tabs -->
        <nav class="my-4">
            <ul class="flex gap-4">
                <li>
                    <NuxtLink :to="`/course/${courseId}`" class="hover:text-blue-500">Lessons</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="`/course/${courseId}/students`" class="hover:text-blue-500">Students</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="`/course/${courseId}/clases`" class="hover:text-blue-500">Statistics</NuxtLink>
                </li>
            </ul>
        </nav>

        <!-- Router view for nested routes -->
        <NuxtPage />
    </main>
</template>

<script setup lang="ts">
import { useCourseStore } from '~/stores/courseStore';
import { CourseForm } from '~/interfaces/modal.interface';
const route = useRoute();
const courseStore = useCourseStore();

onMounted(() => {
    const currentForm = computed(() => courseStore.currentForm);
});

const courseId = route.params.courseId;


const course = computed(() =>
    toRaw(courseStore.courses.find((course: CourseForm) => course.id === 1))
);
if (course.value) {
    courseStore.updateCurrentForm(course.value);
}

</script>