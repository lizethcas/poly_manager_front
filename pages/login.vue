<template>
  <div class="page-container">
    <!-- Wave pattern container -->
    <div class="wave-pattern">
      <div class="image-container img1">
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f" alt="Student 1" />
      </div>
      <div class="image-container img2">
        <img src="https://images.unsplash.com/photo-1629872430082-93d8912beccf" alt="Student 2" />
      </div>
      <div class="image-container img3">
        <img src="https://images.unsplash.com/photo-1627556704290-2b1f5853ff78" alt="Student 3" />
      </div>
      <div class="image-container img4">
        <img src="https://images.unsplash.com/photo-1629872430082-93d8912beccf" alt="Student 4" />
      </div>
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    
    <!-- Existing login form -->
    <div class="login-container">
      <form @submit.prevent="handleLogin" class="login-form">
        <h1>Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <div class="flex flex-column">
          <NuxtLink  type="submit" to="/admin">Login admin</NuxtLink>
          <NuxtLink type="submit" to="/student">Login student</NuxtLink>
        </div>
      </form>
    </div>
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

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.wave-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: -1;
}

.image-container {
  position: absolute;
  border-radius: 20px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img1 {
  width: 250px;
  height: 250px;
  top: 10%;
  right: 15%;
  background-color: #FFD700;
}

.img2 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 35%;
  background-color: #FF69B4;
}

.img3 {
  width: 280px;
  height: 280px;
  top: 60%;
  right: 20%;
  background-color: #9370DB;
}

.img4 {
  width: 220px;
  height: 220px;
  top: 25%;
  right: 5%;
  background-color: #98FB98;
}

.shape {
  position: absolute;
  border-radius: 50%;
}

.shape1 {
  width: 300px;
  height: 300px;
  background-color: rgba(147, 112, 219, 0.2);
  top: 20%;
  right: 25%;
}

.shape2 {
  width: 200px;
  height: 200px;
  background-color: rgba(152, 251, 152, 0.2);
  top: 50%;
  right: 10%;
}

.shape3 {
  width: 250px;
  height: 250px;
  background-color: rgba(255, 215, 0, 0.2);
  top: 70%;
  right: 30%;
}
</style>
