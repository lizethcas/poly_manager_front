import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "~/stores/auth";
import { apiRoutes, post } from "~/services/routes.api";
import { useToast } from "vue-toastification";
import { ref } from "vue";

export const useLogin = () => {
  const authStore = useAuthStore();
  const toast = useToast();
  const error = ref("");
  
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email?: string; password?: string; token?: string }) => {
      console.log('Login credentials:', credentials);
      const endpoint = credentials.token ? apiRoutes.loginGoogle : apiRoutes.login;
      const data = await post(endpoint, credentials);
      if (data.status !== "success") {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    },
    onSuccess: async (data) => {
      console.log('Full login response:', data);
     
      await authStore.setAuth({
        token: data.token,
        user: data.user_data,
        userType: data.user_type,
      });

      if (data.user_type === "teacher") {
        navigateTo("/admin/dashboard");
      } else if (data.user_type === "student") {
        navigateTo("/student/classes");
      }
    },
    onError: (err: Error) => {
      let errorMessage = err.response?.data?.message || err.response?.data?.detail || err.message;
      
      // Handle specific time synchronization error
      if (err.response?.data?.details?.includes('Token used too early')) {
        errorMessage = 'Please check your computer\'s clock is set correctly and try again';
        console.error('Time synchronization error:', err.response.data.details);
      }

      toast.error(errorMessage);
      error.value = errorMessage;
      console.error('Login error:', err);
    },
  });

  return {
    loginMutation,
    error,
  };
}; 