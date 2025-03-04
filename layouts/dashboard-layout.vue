<template>
  <div class="min-h-screen bg-gray-50 flex my-10 w-full lg:w-[90%]">
    <!-- Update sidebar with mobile responsive classes -->
    <div
      :class="`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-48 lg:w-48 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
    >
      <!-- Navigation Links -->
      <nav class="overflow-y-auto h-[calc(100vh-64px)] mt-6">
        <div class=" space-y-4">
          <div v-for="(section, index) in navigationRoutes" :key="index">
            <!-- Section Header -->
            <h3
              class="pl-4 text-base font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >
              {{ section.header }}
            </h3>
            <!-- Navigation Items -->
            <div class="space-y-1">
              <NuxtLink
                v-for="route in section.items"
                :key="route.path"
                :to="route.path"
                class="flex items-center text-[#7B828C] hover:bg-gray-100 rounded-md pl-4 text-sm"
                :class="{ 'text-[#478ADF]': $route.path === route.path }"
                @click="isSidebarOpen = false"
              >
    
                <Icon 
                  :name="route.icon" 
                  size="20" 
                  class="mr-2"
                  :class="{ 'text-[#478ADF]': $route.path === route.path }" 
                />
                <span class="text-base" :class="{ 'text-[#478ADF] ': $route.path === route.path }">
                  {{ route.name }}
                </span>
              </NuxtLink>

            </div>

          </div>
          <!-- Logout Link -->
          <NuxtLink
            to="/login"
            @click.prevent="handleLogout"
            class="flex items-center text-gray-700 hover:bg-gray-100 rounded-md py-2 px-2 mt-4"
          >
            <Icon name="material-symbols:logout" size="20" class="mr-2" />
            Logout
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
              <span class="text-primary-color font-bold text-[20px]">PolyAcademy</span>
            </NuxtLink>
          </div>
          <!-- Search bar -->
          <div class="flex-1 max-w-2xl px-4 hidden sm:block">
            <!-- <SearchInput class="w-full" /> -->
            <SearchMaqueta class="w-full" />
        
          </div>

          <!-- User Profile -->
          <UserProfile
            :profileImage="user.profileImage"
            :userName="user.name"
            :userRole="user.role"
          />

          <!-- Notification Button -->
          <button
            @click="toggleNotificationSidebar"
            class="lg:hidden text-gray-600 hover:text-gray-900 items-center flex"
          >
            <Icon name="material-symbols:notifications" size="24" />
          </button>
        </div>

        <!-- New slot for course navigation -->
        <div class="mx-auto max-w-2xl w-full px-4 mb-2 sm:hidden">
          <SearchInput class="w-full" />
        </div>
      </header>
      <!-- Promotional banner - Only show on student routes -->
      <div
        v-if="route.path.startsWith('/student')"
        class="bg-[#00C6FF] text-white px-4 py-2 rounded-lg mx-5 w-full mt-5"
      >
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
        class="flex flex-col  mt-2 m-auto relative lg:m-5"
        :class="mainContentWidth"
      >
        <!-- Main Content -->
        <main class="flex-1 mt-2 w-full">
          <NuxtPage />
        </main>

        <!-- Notification Sidebar Deskptop -->
        <div
          v-if="!isClassRoute"
          class="w-60 mr-5 hidden lg:block lg:fixed lg:right-0 lg:top-16 lg:bottom-0 bg-white shadow-sm border-l border-gray-200 overflow-y-auto"
        >
          <div class="p-4">
            <div v-for="notification in notifications" :key="notification.id" class="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm" :class="notificationClass(notification.status)">
              <div class="flex items-center gap-2">
                <img :src="notification.userImage" alt="User Image" class="w-10 h-10 rounded-full" />
                <div>
                  <p class="font-semibold">{{ notification.userName }}</p>
                  <p class="text-sm text-gray-500">{{ notification.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Sidebar Mobile  -->

        <div
          :class="[
            isNotificationSidebarOpen ? 'translate-x-0' : 'translate-x-full',
            'fixed inset-y-0 block md:hidden right-0 max-w-xs w-full bg-white shadow-xl transform transition ease-in-out duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:max-w-sm lg:w-60 lg:transform-none'
          ]"
        >
          <div class="h-full flex flex-col pt-5 pb-4 bg-white">
            <div class="px-4 flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Notifications</h2>
              <button
                type="button"
                class="lg:hidden rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="toggleNotificationSidebar"
              >
                <span class="sr-only">Close panel</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mt-1 relative">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center">
                <span class="px-2 bg-white text-sm text-gray-500">5 New</span>
              </div>
            </div>
            <div class="mt-8 flex-1 overflow-y-auto">
              <ul class="divide-y divide-gray-200">
                <li v-for="notification in notifications" :key="notification.id" class="px-4 py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <span class="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        <img :src="notification.userImage" alt="User Image" class="h-full w-full text-gray-300" />
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ notification.userName }}</p>
                      <p class="text-sm text-gray-500 truncate">{{ notification.status }}</p>
                    </div>
                    <div>
                      <span 
                        :class="[
                          'inline-block h-2.5 w-2.5 rounded-full',
                          {
                            'bg-green-400': notification.status === 'online',
                            'bg-yellow-400': notification.status === 'away',
                            'bg-gray-400': notification.status === 'offline'
                          }
                        ]"
                      ></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UserProfile from "~/components/organisim/UserProfile.vue";
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "vue-router";
import { post } from "~/services/routes.api";
import { apiRoutes } from "~/services/routes.api";
import { IconType } from "~/data/iconsType";

const isSidebarOpen = ref(false);
const isNotificationSidebarOpen = ref(false);
const authStore = useAuthStore();
const route = useRoute();
const studentId = computed(() => authStore.getUserId());
console.log(studentId.value);
// Add isProgressRoute computed property
const isProgressRoute = computed(() => {
  return route.path.startsWith("/student/progress");
});


const isClassRoute = computed(() => {
  return (
    /^\/course\/[^/]+\/class\/[^/]+$/.test(route.path) || isProgressRoute.value
  );
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleNotificationSidebar = () => {
  isNotificationSidebarOpen.value = !isNotificationSidebarOpen.value;
};

const user = {
  profileImage: "https://via.placeholder.com/150",
  name: "Mark Andrew Chernetskiy",
  role: "Student",
};

const notifications = ref([
  {
    id: 1,
    userImage: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "John Doe",
    status: "New message received",
  },
  {
    id: 2,
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "Jane Smith",
    status: "Assignment graded",
  },
  {
    id: 3,
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "Alice Johnson",
    status: "New course available",
  },
  {
    id: 4,
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "Bob Brown",
    status: "Payment received",
  },
  {
    id: 5,
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    userName: "Emily White",
    status: "Course completed",
  },
]);

const notificationClass = (status: string) => {
  switch (status) {
    case "New message received":
      return "border-l-4 border-green-500";
    case "Assignment graded":
      return "border-l-4 border-yellow-500";
    case "New course available":
      return "border-l-4 border-blue-500";
    case "Payment received":
      return "border-l-4 border-green-500";
    case "Course completed":
      return "border-l-4 border-red-500";
    default:
      return "";
  }
};

interface NavigationRoute {
  path: string;
  name: string;
  icon: string;
  onClick?: boolean;
}

// Define admin routes with groupings
const adminRoutes = [
  {
    header: "Modules",
    items: [
      {
        path: "/admin/dashboard",
        name: "Dashboard",
        icon: IconType.home,
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
    ],
  },
];

// Define student routes with groupings
const studentRoutes = [
  {
    items: [
      {
        path: studentId.value ? `/student-${studentId.value}/classes` : '/student/classes',
        name: "My Classes",
        icon: IconType.home,
      },
      {
        path: studentId.value ? `/student-${studentId.value}/my-courses` : '/student/courses',
        name: "My Courses",
        icon: IconType.book,
      },
      {
        path: studentId.value ? `/student-${studentId.value}/progress` : '/student/progress',
        name: "My Progress",
        icon: IconType.trendingUp,
      },
    ],
  },

  {
    header: "My Progress",
    items: [
      {
        path: studentId.value ? `/student-${studentId.value}/speaking_practice` : '/student/speaking_practice',
        name: "Speaking Practice",
        icon: IconType.wechat,
      },
      {
        path: studentId.value ? `/student-${studentId.value}/my_notes` : '/student/my_notes',
        name: "My Notes",
        icon: IconType.note,
      },
      {
        path: studentId.value ? `/student-${studentId.value}/my_words` : '/student/my_words',
        name: "My Words",
        icon: IconType.translate,
      },
      {
        path: studentId.value ? `/student-${studentId.value}/my_profile` : '/student/my_profile',
        name: "My Profile",
        icon: IconType.person,
      },
    ],
  },
 /*  {
    header: "Others",

    items: [
      {
        path: `/student-${studentId.value}/my_payments`,
        name: "My Payments",
        icon: "material-symbols:payments-outline",

      },
      {
        path: `/student-${studentId.value}/my_tutor`,
        name: "My Tutor",
        icon: "material-symbols:person-outline",
      },

      {
        path: `/student-${studentId.value}/speaking_clubs`,
        name: "Speaking Clubs",
        icon: "material-symbols:groups",
      },

    ],
  }, */
];

// Update the navigationRoutes computed property with better route detection
const navigationRoutes = computed(() => {
  // Simplify the logic to only check user role
  return authStore.getUserType() === "student" ? studentRoutes : adminRoutes;
});

const mainContentWidth = computed(() => {
  const isStudentRoute = route.path.startsWith("/student");
  return isStudentRoute ? "w-full lg:w-4/5" : "w-full lg:w-4/5";
});

const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    // First clear auth state
    authStore.clearAuth(); // Add this method to your auth store
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.clear();

    // Then make the API call
    try {
      await post(apiRoutes.logout, {
        refresh: refreshToken,
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with navigation even if API fails
    }

    // Use navigateTo for more reliable navigation in Nuxt
    await navigateTo("/login", { replace: true });
  } catch (error) {
    console.error("Error during logout:", error);
    await navigateTo("/login", { replace: true });
  }
};
</script>
