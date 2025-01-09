<template>
  <NuxtLayout>
    <DashboardLayout :navigation-routes="navigationRoutes.admin" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '~/layouts/dashboardLayout.vue'
import { navigationRoutes } from '~/data/routes'

const route = useRoute()
const router = useRouter()

// Add navigation guard to redirect to /admin/courses
onMounted(() => {
  if (route.path === '/admin') {
    router.push('/admin/dashboard')
  }
})
</script>