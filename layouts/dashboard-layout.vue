<template>
  <div class="min-h-screen bg-gray-50 flex my-10 w-[90%] ">
    <!-- Update sidebar with mobile responsive classes -->
    <div
      :class="`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-48 lg:w-48 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
    >
      <!-- Logo section -->

      <!-- Navigation Links -->
      <nav
      
        class="overflow-y-auto h-[calc(100vh-64px)] mt-6"
      >
        <div class="px-4 space-y-2">
          <NuxtLink
            v-for="route in navigationRoutes"
            :key="route.path"
            :to="route.path"
            class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Icon :name="route.icon" class="mr-3 " size="20" />
            {{ route.name }}
          </NuxtLink>
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
    <div class="flex-1 lg:ml-48">
      <!-- Header -->
      <header class="fixed top-0 right-0 lg:left-64 left-0 flex flex-col h-auto bg-white shadow-sm z-20">
        <div class="flex items-center justify-between h-12 px-6">
          <div>
            <NuxtLink to="/" class="flex items-center">
              <span class="text-primary-color font-bold text-md"
                >polyAcademy</span
              >
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
        </div>
        
        <!-- New slot for course navigation -->
        <slot name="header-content"></slot>
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
            <div
              class="flex flex-col w-full h-[500px] border border-gray-300 rounded-lg"
            >
              <Chat />
            </div>
          </div>
        </div>
        <!-- Right Sidebar for Chat -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UserProfile from "~/components/organisim/UserProfile.vue";
import Chat from "~/components/organisim/IA/Chat.vue";
import { useTaskStore } from "~/stores/task.store";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
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
  userType?: string;
  onClick?: boolean;
}

// Define admin routes (renamed from defaultRoutes)
const adminRoutes: NavigationRoute[] = [
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    icon: 'material-symbols:dashboard-outline'
  },
  {
    path: '/admin/courses',
    name: 'Courses',
    icon: 'material-symbols:menu-book-outline',
  },
  {
    path: '/admin/students',
    name: 'Students',
    icon: 'material-symbols:person-outline',
  }
];

// Define student routes
const studentRoutes: NavigationRoute[] = [
  {
    path: '/student/courses',
    name: 'My Courses',
    icon: 'material-symbols:menu-book-outline'
  },
  {
    path: '/student/classes',
    name: 'My Classes',
    icon: 'material-symbols:class-outline'
  },
  {
    path: '/student/progress',
    name: 'My Progress',
    icon: 'material-symbols:trending-up-outline'
  }
];

// Fix the navigationRoutes computed property to avoid infinite recursion
const navigationRoutes = computed(() => {
  // Temporarily hardcoded for testing - you'll need to add proper user role checking
  const isAdmin = route.path.startsWith('/admin'); // Replace with actual user role check
  return isAdmin ? adminRoutes : studentRoutes;
});
</script>

