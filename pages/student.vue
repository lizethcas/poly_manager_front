<template>
  <NuxtLayout>
    <DashboardLayout :navigation-routes="navigationRoutes.student" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '~/layouts/dashboard-layout.vue'
import { navigationRoutes } from '~/data/routes'

const route = useRoute()
const router = useRouter()
// Add navigation guard to redirect to /admin/courses
//provicional
onMounted(() => {
  if (route.path === '/student') {
    router.push('/student/classes')
  }
})
</script>