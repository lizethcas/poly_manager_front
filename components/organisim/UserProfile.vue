<template>
  <div class="flex items-center gap-3 px-4 py-2">
    <div class="relative">
      <img
        :src="profileImage"
        :alt="userName"
        class="w-10 h-10 rounded-full object-cover"
      />
    </div>
    <div class="flex flex-col">
      <h3 class="font-medium text-gray-900 text-sm">{{ userName }}</h3>
      <span class="text-xs text-gray-500">{{ userRole }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {   
  profileImage: string;
  userName: string;
  userRole: string;
}

const props = defineProps<Props>();
</script>
