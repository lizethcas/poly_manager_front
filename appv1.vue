<template>
    <NuxtLayout>
      <IconMolecule :name="IconType.menu" :size="24" @click="toggleSidebar" />
      <div class="min-h-screen bg-gray-50 flex">
        <!-- Add mobile header with hamburger menu -->
        <div
          class="h-fit fixed top-0 right-0 lg:z-0 z-10 flex flex-row gap-2 w-full bg-white py-4 rounded-md items-center lg:hidden"
        >
        
        <IconMolecule :name="IconType.menu" :size="24" @click="toggleSidebar" />
         
        </div>
  
        <!-- Update sidebar with mobile responsive classes -->
        <div
          :class="`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-48 lg:w-64 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
        >
          <!-- Logo section -->
  
          <!-- Navigation Links -->
          <nav class="mt-6 overflow-y-auto h-[calc(100vh-64px)]">
            <div class="px-4 space-y-2">
              <NuxtLink
                to="/dashboard"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Icon name="material-symbols:dashboard-outline" class="mr-3" />
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/courses"
                @click="navigateToDashboard('student')"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Icon name="material-symbols:menu-book-outline" class="mr-3" />
                Courses
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
              <!-- More navigation items -->
            </div>
          </nav>
        </div>
  
        <!-- Add overlay for mobile -->
        <div
          v-if="isSidebarOpen"
          @click="toggleSidebar"
          class="fixed inset-0 z-0 lg:hidden"
        ></div>
  
        <!-- Main Content Area -->
        <div class="flex-1 lg:ml-64">
          <!-- Header -->
          <header
            class="fixed top-0 right-0 lg:left-64 left-0 flex items-center justify-between h-12 px-6 bg-white shadow-sm z-20"
          >
            <div>
              <NuxtLink to="/" class="flex items-center">
                <span class="text-primary-color font-bold text-md">polyAcademy</span>
              </NuxtLink>
            </div>
            <!-- Search bar -->
            <div class="flex-1 max-w-2xl px-4">
              <SearchInput class="w-full" />
            </div>
  
            <!-- User Profile -->
            <UserProfile
              :profileImage="user.profileImage"
              :userName="user.name"
              :userRole="user.role"
            />
          </header>
  
          <!-- Main Content with Right Sidebar Layout -->
          <div class="flex relative mt-5 w-4/5">
            <!-- Main Content -->
            <main class="flex-1 lg:px-4 min-h-screen w-full">
              <NuxtPage />
            </main>
            <div
              v-if="!isClassRoute"
              class="w-80 fixed right-0 top-16 bottom-0 bg-white shadow-sm border-l border-gray-200 overflow-y-auto"
            >
              <div>
                <div class="flex flex-col w-full h-[500px] border border-gray-300 rounded-lg">
                  <Chat />
                </div>
              </div>
            </div>
            <!-- Right Sidebar for Chat -->
          </div>
        </div>
      </div>
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import UserProfile from "~/components/organisim/UserProfile.vue";
  import Chat from "~/components/organisim/IA/Chat.vue";
  import { useTaskStore } from "~/stores/task.store";
  import IconMolecule from '~/components/atomos/Icon.vue';
  import { IconType } from '~/data/iconsType';
  import { useRoute } from 'vue-router';
  
  const taskStore = useTaskStore();
  const isSidebarOpen = ref(false);
  
  const route = useRoute();
  const isClassRoute = computed(() => {
    return /^\/course\/[^/]+\/class\/[^/]+$/.test(route.path);
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const user = {
    profileImage: "https://via.placeholder.com/150",
    name: "Mark Andrew Chernetskiy",
    role: "Content Administrator",
  };
  
  const navigateToDashboard = (userType: string) => {
    taskStore.addTask("userType", userType);
    // Close sidebar on mobile after navigation
    isSidebarOpen.value = false;
  };
  </script>
  