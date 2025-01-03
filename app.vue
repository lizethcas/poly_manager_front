<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-50 flex">
      <div
        class="h-fit px-1 fixed top-0 right-0 lg:z-0 z-10 flex flex-row gap-2 w-full bg-white py-4 rounded-md items-center lg:hidden border-b border-gray-200"
      >
        <Icon
          @click="toggleSidebar"
          name="material-symbols-light:menu"
          size="24"
          class="text-tarawera-600 group-hover:text-fuscous-gray-600"
        />
        <SearchInput class="pr-4 m-auto" />
      </div>

      <!-- Sidebar -->
      <div
        :class="`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-48 lg:w-64 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
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
        <header class="flex items-center justify-between px-4 py-2 bg-white shadow-sm w-full">
          <div class="flex-1 max-w-2xl">
            <SearchInput class="w-full" />
          </div>
          <UserProfile
            :profileImage="user.profileImage"
            :userName="user.name"
            :userRole="user.role"
          />
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto lg:px-4 py-6">
          <NuxtPage />
        </main>

        <!-- Chat IA Component - Moved inside main content area -->
        <div class="fixed right-4 bottom-4">
          <IAChat />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import UserProfile from "~/components/organisim/UserProfile.vue";
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

const user = {
  profileImage: "https://via.placeholder.com/150",
  name: "Mark Andrew Chernetskiy",
  role: "Content Administrator ",
};
</script>
