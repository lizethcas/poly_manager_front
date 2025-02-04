<template>
  <div class="min-h-screen flex bg-white w-full">
    <!-- Wave pattern container -->

    <div class="flex min-h-screen items-center justify-center px-4">
      <!-- Left side - Login Form -->
      <div
        class="w-full max-w-md space-y-8 bg-transparent opacity-100 p-8 rounded-2xl shadow-lg"
      >
        <!-- Back Arrow -->
        <div class="mb-8">
          <button class="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>

        <!-- Welcome Text -->
        <div class="space-y-2">
          <h1 class="text-4xl font-bold text-gray-900">WELCOME</h1>
          <h2 class="text-4xl font-bold text-yellow-400">BACK!</h2>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <div class="relative">
                <input
                  type="text"
                  v-model="email"
                  required
                  class="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Phone, email or username"
                />
                <span class="absolute left-4 top-3 text-gray-400">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  type="password"
                  v-model="password"
                  required
                  class="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Password"
                />
                <span
                  class="absolute right-4 top-3 text-gray-400 cursor-pointer"
                >
                  <i class="fas fa-eye"></i>
                </span>
              </div>
              <div class="mt-2">
                <a
                  href="#"
                  class="text-emerald-400 text-sm hover:text-emerald-500"
                >
                  I don't remember my password
                </a>
              </div>
            </div>
          </div>

          <!-- Agregar mensaje de error -->
          <div v-if="error" class="text-red-500 text-sm mt-2">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              class="w-full py-3 px-4 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>LOG IN</span>
            </button>
          </div>
          <LoginGoogle />
          <!-- Social Login -->
          <!--   <div class="mt-6">
            <div class="flex justify-center space-x-4">
              <button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <img src="~/assets/images/google.png" alt="Google" class="w-6 h-6" />
              </button>
              <button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <img src="~/assets/images/apple.png" alt="Apple" class="w-6 h-6" />
              </button>
              <button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <img src="~/assets/images/facebook.png" alt="Facebook" class="w-6 h-6" />
              </button>
              <button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <img src="~/assets/images/instagram.png" alt="Instagram" class="w-6 h-6" />
              </button>
            </div>
          </div> -->
        </form>
      </div>
      <img
        src="~/assets/images/login.png"
        alt="Logo"
        class="logo z-50 relative w-1/2 h-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginGoogle from "~/components/organisim/LoginGoogle.vue";
import { useLogin } from "~/composables/useLogin";



const email = ref("");
const password = ref("");
const isLoading = ref(false);

const { loginMutation, error } = useLogin();

const handleLogin = async () => {
  await loginMutation.mutate({
    email: email.value,
    password: password.value,
  });
};
</script>
