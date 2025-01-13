<template>
  <div>
    <button 
      @click="handleLogin" 
      class="px-4 py-2 bg-blue-500 text-white rounded"
      :disabled="loading"
    >
      {{ loading ? 'Loading...' : 'Login with Google' }}
    </button>
    
    <div v-if="error" class="text-red-500 mt-2">
      {{ error }}
    </div>
    
    <div v-if="user">
      Welcome, {{ user.displayName }}
      <button @click="handleLogout" class="ml-2 text-sm text-blue-500">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { user, error, loading, signInWithGoogle, signOut } = useAuth();

const handleLogin = async () => {
  await signInWithGoogle();
};

const handleLogout = async () => {
  await signOut();
};
</script> 