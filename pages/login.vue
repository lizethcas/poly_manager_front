<template>
<<<<<<< HEAD
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
=======
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
>>>>>>> b62f8d624e19d918d9b55f9eff4091ae155049ff
  </div>
  <StudentLoginRecord ref="loginRecordRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useMutation } from '@tanstack/vue-query';
import { apiRoutes, post } from '~/services/routes.api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

// Definir la mutación para el login
const loginMutation = useMutation({
  mutationFn: async (credentials: { email: string; password: string }) => {
    const data = await post(apiRoutes.login, credentials);
    if (data.status !== 'success') {
      throw new Error(data.message);
    }
    return data;
  },
  onSuccess: async (data) => {
    await authStore.setAuth({
      token: data.token,
      user: data.user_data,
      userType: data.user_type
    });

    if (data.user_type === 'teacher') {
      router.push('/admin/dashboard');
    } else if (data.user_type === 'student') {
      router.push('/student/dashboard');
    }
  },
  onError: (err: Error) => {
    toast.error(err.message);
    error.value = err.message;
  }
});

const handleLogin = async () => {
  error.value = ""; // Limpiar errores previos
  
  await loginMutation.mutate({
    email: email.value,
    password: password.value
  });
};
</script>



