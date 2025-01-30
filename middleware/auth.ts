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
    console.log('No token found, redirecting to login')
    return navigateTo('/login')
  }

  // Protect admin routes
  if (to.path.startsWith('/admin') && userType !== 'teacher') {
    console.log('Unauthorized access to admin route')
    return navigateTo('/login')
  }

  // Protect student routes
  if (to.path.startsWith('/student') && userType !== 'student') {
    console.log('Unauthorized access to student route')
    return navigateTo('/login')
  }
}) 