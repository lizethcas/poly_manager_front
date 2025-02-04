import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const token = authStore.token
  const userType = authStore.userType

  console.log('Auth Middleware Check:', {
    path: to.path,
    token: !!token, // Log boolean to avoid exposing actual token
    userType,
    localStorageToken: !!localStorage.getItem('access_token')
  })

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