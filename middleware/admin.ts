export default defineNuxtRouteMiddleware((to, from) => {
  // Add your admin authentication logic here
  // return navigateTo('/login') // if not authenticated
  return navigateTo('/admin/dashboard')
}); 