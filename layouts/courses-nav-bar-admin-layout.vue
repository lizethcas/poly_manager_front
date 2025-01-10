<template>
  <div class="admin-layout">
    <!-- Header slot (opcional) -->

    <!-- Navigation bar -->
    <nav class="flex gap-8 border-b border-gray-300">
      <ul class="flex gap-8">
        <li>
          <NuxtLink
            :to="routes.routesAdmin.classes($route.params.courseId as string)"
            class="relative pb-2 font-bold text-gray-60 hover:text-tarawera-700"
            :class="{
              'text-primary-color underline-active':
                $route.path ===
                `/admin/course-${$route.params.courseId}/classes`,
            }"
          >
            Curriculum
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="routes.routesAdmin.students[1]($route.params.courseId as string)"
            class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
            :class="{
              'text-tarawera-700 underline-active':
                $route.path ===
                `/admin/course-${$route.params.courseId}/students`,
            }"
          >
            Students
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="routes.routesAdmin.statistics($route.params.courseId as string)"
            class="relative pb-2 font-medium text-gray-60 hover:text-tarawera-700"
            :class="{
              'text-tarawera-700 underline-active':
                $route.path ===
                `/admin/course-${$route.params.courseId}/statistics`,
            }"
          >
            Stats
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Render the child page -->
   
  </div>
</template>

<script setup lang="ts">
import { routes } from "~/data/routes";
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
