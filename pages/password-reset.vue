<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h2>

      <!-- Paso 1: Solicitar email -->
      <form v-if="step === 1" @submit.prevent="requestReset" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 rounded-lg"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Enviando...' : 'Enviar código' }}
        </button>
      </form>

      <!-- Paso 2: Verificar código y nueva contraseña -->
      <form v-if="step === 2" @submit.prevent="confirmReset" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Código de verificación</label>
          <input 
            v-model="code" 
            type="text" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nueva contraseña</label>
          <input 
            v-model="newPassword" 
            type="password" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 rounded-lg"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Verificando...' : 'Cambiar contraseña' }}
        </button>
      </form>

      <div v-if="error" class="mt-4 text-red-600 text-center">
        {{ error }}
      </div>

      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800">
          Volver al login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const code = ref('')
const newPassword = ref('')
const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const requestReset = async () => {
  try {
    isLoading.value = true;
    console.log('Intentando enviar solicitud a:', 'http://localhost:8000/dashboard/api/request-password-reset/');
    const response = await fetch('http://localhost:8000/dashboard/api/request-password-reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: email.value }),
    });

    console.log('Respuesta completa:', response);
    console.log('Status:', response.status);
    
    const text = await response.text(); // Primero obtener el texto
    console.log('Respuesta texto:', text);
    
    try {
      const data = JSON.parse(text); // Intentar parsear como JSON
      console.log('Datos parseados:', data);
      
      if (data.status === 'success') {
        step.value = 2;
        error.value = '';
      } else {
        error.value = data.message;
      }
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      error.value = 'Error en el formato de respuesta del servidor';
    }
  } catch (e) {
    console.error('Error en la solicitud:', e);
    error.value = 'Error al procesar la solicitud';
  } finally {
    isLoading.value = false;
  }
}

const confirmReset = async () => {
  try {
    isLoading.value = true;
    console.log('Intentando confirmar reset con:', {
      email: email.value,
      code: code.value,
      new_password: newPassword.value
    });

    const response = await fetch('http://localhost:8000/dashboard/api/confirm-password-reset/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
        new_password: newPassword.value,
      }),
    });

    console.log('Respuesta completa:', response);
    console.log('Status:', response.status);
    
    const text = await response.text();
    console.log('Respuesta texto:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Datos parseados:', data);
      
      if (data.status === 'success') {
        alert('Contraseña actualizada exitosamente');
        navigateTo('/login');
      } else {
        error.value = data.message || 'Error al actualizar la contraseña';
      }
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      error.value = 'Error en el formato de respuesta del servidor';
    }
  } catch (e) {
    console.error('Error en la solicitud:', e);
    error.value = 'Error al procesar la solicitud';
  } finally {
    isLoading.value = false;
  }
}
</script> 