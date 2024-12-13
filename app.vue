<template>
    <NuxtLayout>
        <div class="min-h-screen bg-gray-50 flex">
            <!-- Sidebar -->
            <div class="w-64 bg-white shadow-sm fixed h-full">
                <!-- Logo section -->
                <div class="px-6 py-4 border-b">
                    <NuxtLink to="/" class="flex items-center">
                        <span class="text-blue-600 font-bold text-xl">PolyAcademy</span>
                    </NuxtLink>
                </div>

                <!-- Navigation Links -->
                <nav class="mt-6">
                    <div class="px-4 space-y-2">
                        <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            @click="navigateToDashboard('student')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Student
                        </NuxtLink>
                        <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            @click="navigateToDashboard('teacher')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Teacher
                        </NuxtLink>
                        <NuxtLink to="/courses"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            @click="navigateToDashboard('student')">
                            <span class="mr-3">
                                <i class="fas fa-book"></i>
                            </span>
                            Courses estudents
                        </NuxtLink>
                        <NuxtLink to="/courses"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            @click="navigateToDashboard('teacher')">
                            <span class="mr-3">
                                <i class="fas fa-book"></i>
                            </span>
                            Courses teacher
                        </NuxtLink>
                        <NuxtLink to="/students"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            <span class="mr-3">
                                <i class="fas fa-users"></i>
                            </span>
                            Students
                        </NuxtLink>
                        <!-- Add more menu items as needed -->
                    </div>
                </nav>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 ml-64">
                <!-- Header -->
                <header class="bg-white shadow-sm">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <!-- Navigation -->
                            <nav class="flex space-x-8">

                                <NuxtLink to="/teacher"
                                    class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Profesor
                                </NuxtLink>
                                <NuxtLink to="/student"
                                    class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                    estudiante
                                </NuxtLink>
                            </nav>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <NuxtPage />
                </main>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useTaskStore } from '~/stores/task.store';

const taskStore = useTaskStore()
const navigateToDashboard = (userType: string) => {
    taskStore.addTask('userType', userType)
}
</script>
