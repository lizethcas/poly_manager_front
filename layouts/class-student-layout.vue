<template>
  <header
    class="fixed top-0 right-0 lg:left-64 left-0 flex flex-col h-auto bg-white shadow-sm z-20"
  >
    <div class="flex items-center justify-between h-12 px-6">
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
    </div>

    <!-- New slot for course navigation -->
  </header>
  <!-- Main content -->
  <section class="flex justify-between w-full">
    <main class="pr-6 pl-10 my-10 w-full">
      <slot />
    </main>
    <aside v-if="showAside" class="bg-white rounded-xl h-2/6 w-3/12 my-24 p-4">
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
    <button
      v-if="!showAside"
      class="fixed px-4 py-2 bg-primary-color text-white rounded-xl bottom-5 right-0"
      @click="showAside = !showAside"
    >
      salir
    </button>
  </section>
</template>

<script setup lang="ts">
import UserProfile from "~/components/organisim/UserProfile.vue";
import { routes } from "~/data/routes";
const route = useRoute();
const courseId = computed(() => route.params.courseId);
console.log(courseId);

const user = {
  profileImage: "https://via.placeholder.com/150",
  name: "Mark Andrew Chernetskiy",
  role: "Content Administrator",
};

const showAside = ref(true);
</script>
