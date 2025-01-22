<template>
  <div class="min-h-screen bg-gray-50 flex my-10 w-[90%]">
    <!-- Update sidebar with mobile responsive classes -->
    <div
      :class="`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-48 lg:w-48 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
    >
      <!-- Navigation Links -->
      <nav class="overflow-y-auto h-[calc(100vh-64px)] mt-6">
        <div class="px-4 space-y-2">
          <NuxtLink
            v-for="route in navigationRoutes"
            :key="route.path"
            :to="route.path"
            class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
            @click="isSidebarOpen = false"
          >
            <Icon :name="route.icon" size="20" />
            {{ route.name }}
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Add overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-[5] bg-opacity-30 lg:hidden"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 lg:ml-48">
      <!-- Header -->
      <header
        class="fixed top-0 right-0 lg:left-64 left-0 flex flex-col h-auto bg-white shadow-sm z-20"
      >
        <div class="flex items-center gap-2 justify-between h-12 px-4">
          <!-- Add hamburger menu icon -->
          <button
            @click="toggleSidebar"
            class="lg:hidden text-gray-600 hover:text-gray-900 items-center flex"
          >
            <Icon name="material-symbols:menu" size="24" />
          </button>

          <div>
            <NuxtLink to="/" class="flex items-center">
              <span class="text-primary-color font-bold text-md"
                >polyAcademy</span
              >
            </NuxtLink>
          </div>
          <!-- Search bar -->
          <div class="flex-1 max-w-2xl px-4 hidden sm:block">
            <SearchInput class="w-full" />
          </div>

          <!-- User Profile -->
          <UserProfile
            :profileImage="user.profileImage"
            :userName="user.name"
            :userRole="user.role"
          />
        </div>

        <!-- New slot for course navigation -->
        <div class="mx-auto max-w-2xl w-full px-4 mb-2 sm:hidden">
          <SearchInput class="w-full" />
        </div>
      </header>
      <!-- Promotional banner - Only show on student routes -->
      <div v-if="route.path.startsWith('/student')" class="bg-[#00C6FF] text-white px-4 py-2 rounded-lg mx-5 w-full mt-5">
        <div>
          <h2 class="text-xl font-bold">Ahorra en tus estudios!</h2>
          <p class="text-sm">
            ¡Cuéntale a tus amigos sobre PolyAcademy y comparte el enlace y
            obtén un 50% de descuento cada uno!
          </p>
          <button class="text-sm bg-[#FFDD55] px-4 rounded-full text-black">
            Invitar a un amigo
          </button>
        </div>
      </div>
      <!-- Main Content with Right Sidebar Layout -->
      <div
        class="flex flex-col ml-5 mt-2 m-auto relative lg:m-5"
        :class="mainContentWidth"
      >
        <!-- Main Content -->

        <main class="flex-1 mt-2  w-full">
          <NuxtPage />
        </main>
        <div
          v-if="!isClassRoute"
          class="w-60 mr-5 lg:fixed lg:right-0 lg:top-16 lg:bottom-0 hidden lg:block bg-white shadow-sm border-l border-gray-200 overflow-y-auto"
        >
          <div>
            <!--   <Chat /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UserProfile from "~/components/organisim/UserProfile.vue";

import { useRoute } from "vue-router";

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

interface NavigationRoute {
  path: string;
  name: string;
  icon: string;
  onClick?: boolean;
}

// Define admin routes (renamed from defaultRoutes)
const adminRoutes: NavigationRoute[] = [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    icon: "material-symbols:dashboard-outline",
  },
  {
    path: "/admin/courses",
    name: "Courses",
    icon: "material-symbols:menu-book-outline",
  },
  {
    path: "/admin/students",
    name: "Students",
    icon: "material-symbols:person-outline",
  },
];

// Define student routes
const studentRoutes: NavigationRoute[] = [
  {
    path: "/student/classes",
    name: "My Classes",
    icon: "material-symbols:class-outline",
  },
  {
    path: "/student/courses",
    name: "My Courses",
    icon: "material-symbols:menu-book-outline",
  },

  {
    path: "/student/progress",
    name: "My Progress",
    icon: "material-symbols:trending-up-outline",
  },
  {
    path: "/student/speaking_practice",
    name: "Speaking Practice",
    icon: "material-symbols:trending-up-outline",
  },

  {
    path: "/student/my_notes",
    name: "My Notes",
    icon: "material-symbols:trending-up-outline",
  },

  {
    path: "/student/my_words",
    name: "My Words",
    icon: "material-symbols:trending-up-outline",
  },

  {
    path: "/student/my_profile",
    name: "My Profile",
    icon: "material-symbols:trending-up-outline",
  },
];

// Update the navigationRoutes computed property
const navigationRoutes = computed(() => {
  // Check if the current route starts with /student
  const isStudent = route.path.startsWith("/student");
  return isStudent ? studentRoutes : adminRoutes;
});

const mainContentWidth = computed(() => {
  const isStudentRoute = route.path.startsWith("/student");
  return isStudentRoute ? "w-full lg:w-4/5" : "w-full lg:w-4/5";
});
</script>
