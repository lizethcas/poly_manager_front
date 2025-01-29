import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  token: string | null;
  user: User | null;
  userType: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    userType: null
  }),

  actions: {
    setAuth(payload: { token: string; user: User; userType: string }) {
      this.token = payload.token;
      this.user = payload.user;
      this.userType = payload.userType;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.userType = null;
    },

    validateToken() {
      const token = this.token
      if (!token) return false
      
      try {
        // Basic JWT expiration check
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expiration = payload.exp * 1000 // Convert to milliseconds
        
        if (Date.now() >= expiration) {
          this.clearAuth()
          return false
        }
        
        return true
      } catch (error) {
        this.clearAuth()
        return false
      }
    },
    
    clearAuth() {
      this.token = null
      this.user = null
      this.userType = null
    }
  }
}); 

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  addRouteMiddleware('auth', () => {
    if (!authStore.validateToken()) {
      return navigateTo('/login')
    }
  })
  
  // Add axios interceptor for API calls
  axios.interceptors.request.use(config => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })
  
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        authStore.clearAuth()
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )
})