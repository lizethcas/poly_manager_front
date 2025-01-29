import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = authStore.token
  const userType = authStore.userType

  // If there's no token, redirect to login
  if (!token) {
    return navigateTo('/login')
  }

  // Protect admin routes
  if (to.path.startsWith('/admin') && userType !== 'teacher') {
    return navigateTo('/login')
  }

  // Protect student routes
  if (to.path.startsWith('/student') && userType !== 'student') {
    return navigateTo('/login')
  }
}) 