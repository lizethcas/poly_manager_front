import { useMutation } from "@tanstack/vue-query";
import { apiRoutes, post } from "~/services/routes.api";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

export const useEnrollMutation = () => {
  const toast = useToast();
  const route = useRoute();
  const authStore = useAuthStore();
  
  // Obtener el ID del estudiante desde la ruta o desde el store de autenticación
  const studentId = route.params.studentId?.toString() || authStore.getUserId();
  
  return useMutation({
    mutationFn: (courseId: string) => {
      // Usar studentId en la URL y courseId en el cuerpo
      return post(apiRoutes.students.enrollCourse(studentId), {
        course_id: courseId,
      });
    },
    onSuccess: () => {
      toast.success("Inscripción exitosa");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Error en la inscripción");
    },
  });
};