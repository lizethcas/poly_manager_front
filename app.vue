<template>
  <NuxtLayout>
    <nav v-if="showMainNavigation" class="flex justify-between items-center p-4 bg-gray-200">
      <ul class="flex gap-4">
        <li>
          <NuxtLink to="/">polyAcademy</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/login">login</NuxtLink>
        </li>
      </ul>
    </nav>

    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const showMainNavigation = computed(() => {
  return !['/admin', '/student', '/dashboard'].some(path => route.path.startsWith(path))
})
</script>
