<template>
  <div>
    
    <h1>Lista de Estudiantes</h1>
    <table v-if="students.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre de Usuario</th>
          <th>Correo Electrónico</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" 
            :key="student.id" 
            @click="navigateToStudentCourses(student.id)"
            class="cursor-pointer hover:bg-gray-100">
          <td>{{ student.id }}</td>
          <td>{{ student.user_username }}</td>
          <td>{{ student.user_email }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay estudiantes registrados.</p>
    <div v-if="message" :class="{ 'error': isError, 'success': !isError }">
      {{ message }}
    </div>
    
    <div class="greeting-section">
      <h2>Saludos a los Estudiantes</h2>
      <ul>
        <li v-for="student in students" :key="student.id">
          ¡Hola, {{ student.user_username }}!
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axios.config';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      students: [],
      message: '',
      isError: false
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axiosInstance.get('students/');
        console.log('Respuesta del servidor:', response.data); // Para debugging
        if (response.data.status === 'success') {
          this.students = response.data.data;
          this.message = 'Estudiantes cargados exitosamente';
          this.isError = false;
          console.log('Estudiantes:', this.students);
        }
      } catch (error) {
        this.isError = true;
        this.message = 'Error al cargar los estudiantes';
        console.error('Error al cargar estudiantes:', error);
      }
    },
    navigateToStudentCourses(studentId) {
      const courseId = 1;
      const classId = 1;
      this.router.push(`/students-${studentId}`);
    }
  },
  mounted() {
    this.fetchStudents();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f3f4f6;
}

.greeting-section {
  background-color: #e0f7fa; /* Cambia el color de fondo según lo desees */
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.greeting-section h2 {
  color: #00796b; /* Cambia el color del texto según lo desees */
}

.greeting-section ul {
  list-style-type: none;
  padding: 0;
}

.greeting-section li {
  margin: 5px 0;
}
</style>
