<template>
  <div class="flex">
    <!-- Sidebar Navigation -->
    <nav class="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div class="space-y-4">
        <NuxtLink 
          :to="`/admin/course-${$route.params.courseId}`"
          class="block px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': $route.path === `/admin/course-${$route.params.courseId}` }"
        >
          General
        </NuxtLink>
        <NuxtLink 
          :to="`/admin/course-${$route.params.courseId}/content`"
          class="block px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': $route.path.includes('/content') }"
        >
          Contenido
        </NuxtLink>
        <NuxtLink 
          :to="`/admin/course-${$route.params.courseId}/students`"
          class="block px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': $route.path.includes('/students') }"
        >
          Estudiantes
        </NuxtLink>
        <NuxtLink 
          :to="`/admin/course-${$route.params.courseId}/settings`"
          class="block px-4 py-2 rounded-lg hover:bg-gray-100"
          :class="{ 'bg-gray-100': $route.path.includes('/settings') }"
        >
          Configuración
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 p-8">
      <slot />
    </div>
  </div>
</template> 