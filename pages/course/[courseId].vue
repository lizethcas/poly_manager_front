<template>
    <!-- Contenedor de cargando que ocupa toda la página -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <p class="text-title-color text-2xl">Cargando...</p>
    </div>

    <!-- El contenido del curso una vez cargado -->
    <div v-if="courses">
        <SearchInput />
        <header class=" text-title-color mb-4 flex items-center">
            
            <img src="~/assets/images/back-button-round.webp" alt="regresar una pagina"
                class="w-8 h-8 cursor-pointer items-center m-2 my-4" @click="handleBackNavigation" />
            <div class="w-4/5">
                <OrganismCourseCard :coursesData="courses" />
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
                                    'text-primary-color underline-active': $route.path === `/course/${routeCourseId}`
                                }">
                                Curriculum
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
                                Stats
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetColor } from '~/composables/useGetColor';
import { useCoursesQuery } from '~/composables/useCourseQuery';
import type { CourseForm } from '~/interfaces/modal.interface';
import OrganismCourseCard from "~/components/organisim/CourseCard.vue";


const route = useRoute();

const routeCourseId = route.params.courseId as string;

// Use the shared query composable
const { data: courses, isLoading, error } = useCoursesQuery()
console.log(courses.value)
// Get the specific course using computed
/* const course = computed(() => {
    if (!courses.value) return null;
    console.log(courses.value.find((course: CourseForm) => course.id === Number(routeCourseId)))
    return courses.value.find((course: CourseForm) => course.id === Number(routeCourseId));
}); */

const handleBackNavigation = () => {
  if (route.path.includes('/class/')) {
    navigateTo(`/course/${routeCourseId}`);
  } else {
    navigateTo('/courses/');
  }
};
</script>