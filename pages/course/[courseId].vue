<template>
    <!-- Contenedor de cargando que ocupa toda la página -->
    <div v-if="!course" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <p class="text-title-color text-2xl">Cargando...</p>
    </div>

    <!-- El contenido del curso una vez cargado -->
    <div v-if="course">
        <header class="pt-6 px-14 text-title-color mb-15 flex items-center">
            <img src="~/assets/images/back-button-round.webp" alt="regresar una pagina"
                class="w-10 h-10 cursor-pointer items-center" @click="navigateTo('/')" />
            <div class="flex items-start">
                <img v-if="course.cover" :src="getCoverUrl(course.cover)" alt=""
                    class="mx-4 object-cover w-36 h-36 border-2 rounded-xl" />
                <!-- <img v-if="course.cover"
                    :src="typeof course.cover === 'string' ? course.cover : URL.createObjectURL(course.cover)"
                    :alt="course.course_name" class="mx-4 object-cover w-36 h-36 border-2 rounded-xl" /> -->
                <div class="flex flex-col items-start">
                    <h2 class="text-tarawera-700 font-bold text-2xl">{{ course.course_name }}</h2>
                    <div class="flex items-center">
                        <div :class="['rounded-full w-10  flex items-start ', getLevelColor(course.level)]">
                            <p :class="[
                                'text-sm font-bold rounded-full px-2 py-1',
                                getLevelColor(course.level, true)
                            ]" v-if="course.level">
                                {{ course.level.split(".")[0] }}
                            </p>
                        </div>
                        <h3 v-if="course.level" class="text-sm font-bold" :class="getLevelColor(course.level)">
                            {{ course.level.split(' ').length > 1
                                ? (course.level.split(' ')[2]
                                    ? `${course.level.split(' ')[1]} ${course.level.split(' ')[2]}`
                                    : course.level.split(' ')[1])
                                : course.level.split(' ')[1] }}
                        </h3>
                    </div>

                    <div class=" text-xs flex items-start w-10/12 mt-4">
                        <p class="text-gray-high border-2 border-gray-light rounded-full px-2">published</p>
                        <p class="text-gray-high border-2 border-gray-light rounded-full px-2">2</p>
                        <p class="text-gray-high border-2 border-gray-light rounded-full px-2 ">45</p>
                    </div>
                </div>
            </div>
        </header>

        <main class="px-14 mb-4">
            <!-- Navigation tabs -->
            <NuxtLayout>
                <nav class="flex justify-start gap-4 border-b border-gray-300">
                    <ul class="flex gap-8">
                        <li>
                            <NuxtLink :to="`/course/${routeCourseId}`"
                                class="relative pb-2 font-bold text-gray-60 hover:text-tarawera-700" :class="{
                                    'text-tarawera-700 underline-active': $route.path === `/course/${routeCourseId}`
                                }">
                                Lessons
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :to="`/course/${routeCourseId}/students`"
                                class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700" :class="{
                                    'text-tarawera-700 underline-active': $route.path === `/course/${routeCourseId}/students`
                                }">
                                Students
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :to="`/course/${routeCourseId}/statistics`"
                                class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700" :class="{
                                    'text-tarawera-700 underline-active': $route.path === `/course/${routeCourseId}/statistics`
                                }">
                                Statistics
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>

                <!-- Render the route components here -->
                <NuxtPage />
            </NuxtLayout>
        </main>
    </div>
</template>


<script setup lang="ts">
import { toRaw, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStore } from '~/stores/courseStore';
import { useGetColor } from '~/composables/useGetColor';
import type { CourseForm } from '~/interfaces/modal.interface';

const route = useRoute();
const courseStore = useCourseStore();
const { getLevelColor } = useGetColor();
const { getCoverUrl } = useGetCover();

const routeCourseId = route.params.courseId as string;
const courseIdNumber = routeCourseId;
console.log(toRaw(courseStore.courses))

const course = computed(() => {
    const foundCourse = courseStore.courses.find((course: CourseForm) => course.id === Number(courseIdNumber));
    if (!foundCourse) {
        console.error('Curso no encontrado');
        return null;
    }
    return toRaw(foundCourse);
});

if (course.value) {
    courseStore.updateCurrentForm(course.value);
}



</script>
