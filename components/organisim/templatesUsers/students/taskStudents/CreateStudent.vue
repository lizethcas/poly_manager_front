<template>
  <div>
    <h1>Crear Estudiante</h1>
    <form @submit.prevent="registerStudent">
      <div>
        <label for="username">Nombre de Usuario:</label>
        <input type="text" v-model="student.username" required />
      </div>
      <div>
        <label for="email">Correo Electrónico:</label>
        <input type="email" v-model="student.email" required />
      </div>
      <button type="submit">Registrar Estudiante</button>
    </form>
    <div v-if="message" :class="{ 'error': isError, 'success': !isError }">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axios.config';

export default {
  data() {
    return {
      student: {
        username: '',
        email: ''
      },
      message: '',
      isError: false
    };
  },
  methods: {
    async registerStudent() {
      try {
        console.log("Datos enviados:", this.student);
        const response = await axiosInstance.post('students/create/', this.student);
        
        if (response.data.status === 'success') {
          this.message = 'Estudiante registrado exitosamente';
          this.isError = false;
          // Limpiar el formulario después de un registro exitoso
          this.student = {
            username: '',
            email: ''
          };
        } else {
          this.isError = true;
          this.message = response.data.message || 'Error al registrar el estudiante';
        }
      } catch (error) {
        this.isError = true;
        if (error.response && error.response.data) {
          this.message = error.response.data.message || 'Error al registrar el estudiante';
          console.error('Errores de validación:', error.response.data.errors);
        } else {
          this.message = 'Error al registrar el estudiante';
        }
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>
