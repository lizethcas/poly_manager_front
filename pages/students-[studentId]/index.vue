<template>
  <div>
    <h1>Estudiante</h1>
    <div>
        <h2>Mis cursos</h2>
    </div>
  </div>
  <div>
    <CourseCardStudent :courses="coursesData" v-if="!isLoading" />
    <div v-else>Cargando cursos...</div>
  </div>
</template>
<script setup lang="ts">
import CourseCardStudent from '~/components/organisim/templatesUsers/students/CourseCardStudent.vue';
import { useQuery } from '@tanstack/vue-query';
import { apiRoutes, get } from '~/services/routes.api';

// Obtenemos el studentId de la ruta
const route = useRoute();
const studentId = route.params.studentId;

// Definimos la query para obtener los cursos
const { data: coursesData, isLoading } = useQuery({
  queryKey: ['courses', studentId],
  queryFn: () => get(apiRoutes.courses)
});
</script>