<template >
  <header
    class="fixed top-0 right-0 lg:left-64 left-0 flex flex-col h-auto bg-white shadow-sm z-20"
  >
    <div class="flex items-center gap-2 justify-between h-12 px-4" v-if="showAside">
      <div>
        <NuxtLink to="/" class="flex items-center">
          <span class="text-primary-color font-bold text-md">polyAcademy</span>
        </NuxtLink>
      </div>
      <!-- Search bar - hidden on mobile -->
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

    <!-- Search bar - only visible on mobile -->
    <div class="mx-auto max-w-2xl w-full px-4 mb-2 sm:hidden" v-if="showAside">
      <SearchInput class="w-full" />
    </div>
  </header>
  <!-- Main content -->
  <section class="flex justify-between w-full lg:mt-1">
    <main :class="[
      'lg:pr-6 lg:pl-2 lg:my-10 transition-all duration-300 px-6',
      showAside ? 'lg:w-4/5 mt-24' : 'w-full mt-12',
    ]">
      <slot />
    </main>
    <!-- Modified aside for mobile support -->
    <aside 
      :class="[
        'bg-white rounded-xl h-2/6 transition-all duration-300 p-4 fixed right-0',
        showAside ? 'translate-x-0' : 'translate-x-full',
        'lg:w-1/5 w-min-1/5 lg:my-14 mt-24 top-0 lg:top-auto',
        'lg:block'
      ]"
    >
      <div class="flex flex-col items-start">
        <NuxtLink
          :to="routes.routesStudent.course(courseId as string)"
          class="text-left"
        >
          Go back to dashboard
        </NuxtLink>
        <button @click="showAside = !showAside">Toggle Aside</button>
      </div>
    </aside>
    <!-- Modified toggle button -->
    <button
      v-if="!showAside"
      class="fixed px-4 py-2 bg-primary-color text-white rounded-xl bottom-5 right-5"
      @click="showAside = !showAside"
    >
      Show Menu
    </button>
  </section>
</template>

<script setup lang="ts">
import UserProfile from "~/components/organisim/UserProfile.vue";
import { routes } from "~/data/routes";
const route = useRoute();
const courseId = computed(() => route.params.courseId);

const user = {
  profileImage: "https://via.placeholder.com/150",
  name: "Mark Andrew Chernetskiy",
  role: "Content Administrator",
};

// Modify the showAside logic to default to false on mobile
const isLargeScreen = ref(process.client ? window.innerWidth >= 1024 : true);
const showAside = ref(process.client ? window.innerWidth >= 1024 : false);

// Add window resize listener
if (process.client) {
  window.addEventListener('resize', () => {
    isLargeScreen.value = window.innerWidth >= 1024;
    showAside.value = isLargeScreen.value;
  });
}
</script>
