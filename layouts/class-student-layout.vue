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
    <slot name="header-content"></slot>
  </header>
</template>

<script setup lang="ts">
import UserProfile from "~/components/organisim/UserProfile.vue";

const user = {
  profileImage: "https://via.placeholder.com/150",
  name: "Mark Andrew Chernetskiy",
  role: "Content Administrator",
};
</script>
