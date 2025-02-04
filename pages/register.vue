<template>
  <div class="register-container">
    <form @submit.prevent="handleSubmit" class="register-form">
      <h2>Registro de Usuario</h2>
      
      <div class="form-group">
        <label for="name">Nombre Completo</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
        >
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="formData.password" 
          required
        >
      </div>

      <div class="form-group">
        <label for="profile_picture">Foto de Perfil</label>
        <input 
          type="file" 
          id="profile_picture" 
          @change="handleFileChange"
          accept="image/*"
        >
      </div>



      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { axiosDashboard } from '../services/axios.config'

const formData = ref({
  name: '',
  email: '',
  password: '',
  profile_picture: null,
  userType: 'student'
})

const isLoading = ref(false)
const message = ref('')
const messageType = ref('')

const handleFileChange = (event) => {
  formData.value.profile_picture = event.target.files[0]
}

const handleSubmit = async () => {
  isLoading.value = true
  message.value = ''
  

  try {
    const form = new FormData()
    form.append('username', formData.value.name)
    form.append('email', formData.value.email)
    form.append('password', formData.value.password)
    if (formData.value.profile_picture) {
      form.append('profile_picture', formData.value.profile_picture)
    }

    const endpoint = formData.value.userType === 'teacher' ? 'teachers/' : 'students/create/'

    const response = await axiosDashboard.post(endpoint, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })


    if (response.data.status === 'success') {
      message.value = '¡Registro exitoso!'
      messageType.value = 'success'
      // Limpiar el formulario
      formData.value = {
        name: '',
        email: '',
        password: '',
        profile_picture: null,
        userType: 'teacher'
      }
    }
  } catch (error) {
    console.error('Error al registrar el usuario:', error)
    message.value = error.response?.data?.message || 'Error al registrar el usuario'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-form {
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

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}
</style>
