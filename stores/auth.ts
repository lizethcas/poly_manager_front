import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  token: string | null;
  user: User | null;
  userType: string | null;
  userId: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // Safely get and parse user data from localStorage
    let user = null;
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }

    return {
      token: localStorage.getItem('token') || null,
      user: user,
      userType: localStorage.getItem('userType') || null,
      userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null
    };
  },

  actions: {
    setAuth(payload: {
      token: string;
      user: User;
      userType: string;
      userId: number;
    }) {
      this.token = payload.token;
      this.user = payload.user;
      this.userType = payload.userType;
      this.userId = payload.userId;
      
      // Persist in localStorage with validation
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('userType', payload.userType);
      if (payload.userId !== undefined) {
        localStorage.setItem('userId', payload.userId.toString());
      }
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    getUserType() {
      return this.userType;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.userType = null;
      this.userId = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    },

    validateToken() {
      const token = this.token;
      if (!token) return false;
      
      try {
        // Basic JWT expiration check
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000; // Convert to milliseconds
        
        if (Date.now() >= expiration) {
          this.clearAuth();
          return false;
        }
        
        return true;
      } catch (error) {
        this.clearAuth();
        return false;
      }
    },
    
    clearAuth() {
      // Reset all auth-related state
      this.user = null;
      this.token = null;
      // Reset any other auth-related state
    },

    getUserId() {
      console.log('Current userId:', this.userId);
      return this.userId;
    }
  }
}); 