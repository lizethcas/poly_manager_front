<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Inicio de Sesión</h2>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="Ingrese su correo electrónico"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
          placeholder="Ingrese su contraseña"
        />
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>
  </div>
  <StudentLoginRecord ref="loginRecordRef" />
</template>

<script setup>
import { ref } from 'vue'
import { axiosDashboard } from '../services/axios.config'
import { useRouter } from 'vue-router'
import StudentLoginRecord from '../components/atomos/StudentLoginRecord.vue'

const router = useRouter()
const loginRecordRef = ref(null)
const formData = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const message = ref('')
const messageType = ref('')

const handleLogin = async () => {
  isLoading.value = true
  message.value = ''
  
  try {
    // Primero intentamos login como profesor
    try {
      const teacherResponse = await axiosDashboard.post('/teachers/login/', {
        email: formData.value.email,
        password: formData.value.password
      })

      if (teacherResponse.data.status === 'success') {
        localStorage.setItem('token', teacherResponse.data.token)
        localStorage.setItem('teacherId', teacherResponse.data.teacher.id)
        localStorage.setItem('userType', 'teacher')
        message.value = '¡Inicio de sesión exitoso!'
        messageType.value = 'success'
        navigateTo('/admin')
        return
      }
    } catch (teacherError) {
      // Si falla el login como profesor, intentamos como estudiante
      try {
        const studentResponse = await axiosDashboard.post('/students/login/', {
          email: formData.value.email,
          password: formData.value.password
        })

        if (studentResponse.data.status === 'success') {
          localStorage.setItem('token', studentResponse.data.token)
          localStorage.setItem('studentId', studentResponse.data.student.id)
          localStorage.setItem('userType', 'student')
          
          // Registrar el login del estudiante
          await loginRecordRef.value?.recordStudentLogin(studentResponse.data.student.id)
          
          message.value = '¡Inicio de sesión exitoso!'
          messageType.value = 'success'
          navigateTo('/student')
          return
        }
      } catch (studentError) {
        throw new Error('Credenciales inválidas')
      }
    }
  } catch (error) {
    console.error('Error detallado:', error)
    message.value = 'Credenciales inválidas'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}
</style>
