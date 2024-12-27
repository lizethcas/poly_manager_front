<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Hamburger Menu Button (Mobile) -->
      <!--  <button
        @click="toggleSidebar"
        class="lg:hidden fixed top-4 left-4 z-20 p-2"
      >
        <i class="fas fa-bars text-2xl">menu</i>
      </button> -->
      <div class="h-fit p-2">
        <Icon
          @click="toggleSidebar"
          name="solar:list-bold"
          size="20"
          class="text-tarawera-600 group-hover:text-fuscous-gray-600 lg:hidden"
        />
      </div>

      <!-- Sidebar -->
      <div
        :class="`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-48 lg:w-64 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out z-10`"
      >
        <!-- Logo section -->
        <div class="px-6 py-4 border-b">
          <NuxtLink class="flex items-center">
            <span class="text-[#478ADF] font-bold text-md">PolyAcademy</span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-6">
          <div class="px-4 space-y-2">
            <!--   <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            :class="{ 'bg-blue-50 text-blue-600': $route.path === '/dashboard' }"
                            @click="navigateToDashboard('student')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Student
                        </NuxtLink>
                        <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            :class="{ 'bg-blue-50 text-blue-600': $route.path === '/dashboard' }"
                            @click="navigateToDashboard('teacher')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Teacher
                        </NuxtLink> -->
            <NuxtLink
              to="/courses"
              class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
              @click="navigateToDashboard('student')"
            >
              <span class="">
                <i class="fas fa-book"></i>
              </span>
              Courses estudents
            </NuxtLink>
            <NuxtLink
              to="/courses"
              class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
              @click="navigateToDashboard('teacher')"
            >
              <span class="">
                <i class="fas fa-book"></i>
              </span>
              Courses teacher
            </NuxtLink>
            <!--  <NuxtLink 
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            <span class="mr-3">
                                <i class="fas fa-users"></i>
                            </span>
                            Students
                        </NuxtLink> -->
            <!-- Add more menu items as needed -->
          </div>
        </nav>
      </div>

      <!-- Overlay for mobile -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-0 lg:hidden"
      ></div>

      <!-- Main Content Area -->
      <div class="flex-1 lg:ml-64">
        <!-- Header -->
        <header class="bg-white shadow-sm"></header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto pr-4 lg:px-4 py-6">
          <NuxtPage />
        </main>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task.store";
import { ref } from "vue";

const taskStore = useTaskStore();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const navigateToDashboard = (userType: string) => {
  taskStore.addTask("userType", userType);
  // Close sidebar on mobile after navigation
  isSidebarOpen.value = false;
};
</script>
