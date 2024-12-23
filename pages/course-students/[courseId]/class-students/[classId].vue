<template>
<h1>Class Students</h1>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Class Students</h1>
    
    <!-- Show loading state -->
    <div v-if="isPending">Loading...</div>
    
    <!-- Show error state -->
    <div v-else-if="error">Error: {{ error.message }}</div>
    
    <!-- Show class details and students -->
    <div v-else>
      <h2 class="text-xl mb-4">Course ID: {{ courseId }}</h2>
      <h3 class="text-lg mb-4">Class ID: {{ classId }}</h3>
      
      <div v-if="students?.length">
        <ul class="space-y-2">
          <li v-for="student in students" :key="student.id">
            {{ student.name }}
          </li>
        </ul>
      </div>
      <div v-else>
        No students found in this class.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.courseId as string
const classId = route.params.classId as string

// Add this composable to fetch students (you'll need to create this)
const { data: students, isPending, error } = useClassContentQuery(classId)
</script> 