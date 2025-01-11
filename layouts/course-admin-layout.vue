<template>
  <div>
    <!-- Contenedor de cargando que ocupa toda la página -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <p class="text-title-color text-2xl">Cargando...</p>
    </div>

    <!-- Contenido principal del layout -->
    <div v-else>
      <!-- Navbar Persistente -->
      <nav class="flex gap-8 border-b border-gray-300 mt-6 px-8">
        <ul class="flex gap-8">
          <li>
            <NuxtLink
              :to="routes.routesAdmin.classes(routeCourseId)"
              class="relative pb-2 font-bold text-gray-60 hover:text-tarawera-700"
              :class="{
                'text-primary-color underline-active':
                  $route.path === `/admin/course-${routeCourseId}/classes`,
              }"
            >
              Curriculum
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="routes.routesAdmin.students[1](routeCourseId)"
              class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
              :class="{
                'text-tarawera-700 underline-active':
                  $route.path === `/admin/course-${routeCourseId}/students`,
              }"
            >
              Students
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="routes.routesAdmin.statistics(routeCourseId)"
              class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
              :class="{
                'text-tarawera-700 underline-active':
                  $route.path === `/admin/course-${routeCourseId}/statistics`,
              }"
            >
              Stats
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Contenido dinámico de la ruta -->
      <div class="p-8">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { routes } from "~/data/routes";

const route = useRoute();
const routeCourseId = route.params.courseId as string;

// Simula un estado de carga para el ejemplo
const isLoading = false;
</script>

<style lang="postcss" scoped>
.nav-link {
  @apply px-4 py-2 rounded-lg transition-colors hover:text-primary-color;
}
.nav-link-active {
  @apply bg-primary-color text-white;
}
</style>
