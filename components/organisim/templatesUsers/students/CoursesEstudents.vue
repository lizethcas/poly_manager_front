<template>
  <div class="w-full">
    <header class="pt-20 px-14 text-title-color mb-4 m-auto">
      <h1 class="text-xl font-bold">Mis Cursos</h1>
      <UDivider class="border-gray-500 py-6" type="solid"></UDivider>
    </header>

    <main class="px-14 w-full text-title-color mb-24 flex flex-wrap items-center justify-evenly">
      <!-- Error state -->
      <Error 
        v-if="error" 
        :error="error" 
        :message="error.message" 
        @refetch="refetch" 
      />

      <!-- Loading state -->
      <Loading v-if="isLoading" />

      <!-- Data display -->
      <div v-if="courses" class="w-full">
        <OrganismCourseCard :courses-data="courses" />
      </div>

      <!-- No data state -->
      <div v-else class="w-full text-center py-8">
        <p class="text-gray-500">No hay cursos disponibles</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { apiRoutes, get } from '@/services/routes.api'
import OrganismCourseCard from '~/components/organisim/CourseCard.vue'
import Error from '~/components/organisim/alerts/Error.vue'
import Loading from '~/components/organisim/alerts/Loading.vue'
import { useCoursesQuery } from '~/composables/useCoursesQuery';

// Use Vue Query hook
const { data: courses, isLoading, error, refetch } = useCoursesQuery()

</script>
