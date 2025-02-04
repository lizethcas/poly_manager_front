<template>
    <div class="max-w-sm rounded-3xl bg-purple-200 p-6 relative overflow-hidden">
        <div class="relative z-10">
            <h2 class="text-3xl font-semibold text-purple-700 mb-4">{{ title }}</h2>
            <p class="text-purple-600 mb-8">{{ description }}</p>
            <div class="inline-block" @click="navigateTo(`/student-${studentId}/courses`)">
                <div class="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
        <img 
            :src="image" 
            :alt="title"
            class="absolute right-0 bottom-0 h-full object-cover object-right"
        />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const studentId = authStore.getUserId();

defineProps<{
    title: string
    description: string
    image: string
}>()


</script>