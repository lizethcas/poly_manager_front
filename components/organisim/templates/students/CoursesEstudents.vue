<template>
    <div>
        <h1>Courses Students</h1>
        
        <!-- Loading state -->
        <div v-if="isLoading" class="text-title-color">Loading...</div>
        
        <!-- Error state -->
        <div v-if="error" class="text-title-color">Error: {{ error.message }}</div>
        
        <!-- Data display -->
        <div v-if="courses">
            <OrganismCourseCard :courses-data="courses" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { apiRoutes, get } from '@/services/routes.api'
import OrganismCourseCard from '~/components/organisim/CourseCard.vue'
// Define the fetch function
const fetchCourses = async () => {
  try {
    const response = await get(apiRoutes.courses)
    console.log('Courses data:', response)
    return response
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

onMounted(() => {
    console.log('Component mounted', courses)
})

// Use Vue Query hook
const { data: courses, isLoading, error } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
  staleTime: 0
})
</script>

