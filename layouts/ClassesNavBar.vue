<!-- navbar dentro de cada curso -->

<template>
    <nav class="flex justify-start gap-4 border-b border-gray-300">
                <ul class="flex gap-8">
                    <li>
                        <NuxtLink :to="`/course/${courseId}`"
                            class="relative pb-2 font-medium text-gray-60 hover:text-fresh-green" :class="{
                                'text-fresh-green underline-active': $route.path === `/course/${courseId}`} ">
                            Lessons
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="`/course/${courseId}/students`"
                        class="relative pb-2 font-medium text-gray-60 hover:text-fresh-green" :class="{
                                'text-fresh-green underline-active': $route.path === `/course/${courseId}/students`
                            }">
                            Students
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="`/course/${courseId}/clases`"
                            class="relative pb-2 font-medium text-gray-60 hover:text-fresh-green" :class="{
                                'text-fresh-green underline-active': $route.path === `/course/${courseId}/clases`
                            }">
                            Statistics
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
</template>

<script>
import { useRoute } from 'vue-router';
import { classesData } from '@/data';

const route = useRoute();
const courseId = route.params.courseId as string;
</script>