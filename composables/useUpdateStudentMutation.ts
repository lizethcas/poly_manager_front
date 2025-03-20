import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { patch } from '~/services/routes.api';
import { apiRoutes } from '~/services/routes.api';
import type { Student } from './useStudentQuery';
import { useToast } from 'vue-toastification';

export interface UpdateStudentPayload {
  id: string;
  data: Partial<Student> | FormData;
}

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateStudentPayload) => {
      // Convertir a FormData si no lo es ya
      let formData: FormData;
      if (!(data instanceof FormData)) {
        formData = new FormData();
        // Iterar sobre las propiedades y agregarlas al FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      } else {
        formData = data;
      }
      
      const response = await patch(apiRoutes.students.getById(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    },
    onSuccess: (response, variables) => {
      // La respuesta tiene estructura { status, message, data }
      // Donde data contiene los datos del estudiante actualizado
      
      // Actualizar directamente la caché con el nuevo valor
      queryClient.setQueryData(['student', variables.id], oldData => {
        // Si tenemos datos antiguos, conservamos cualquier propiedad no incluida en la respuesta
        if (oldData) {
          return { ...oldData, ...response.data };
        }
        return response.data;
      });
      
      toast.success(response.message || 'Información actualizada exitosamente');
    },
    onError: (error) => {
      console.error('Error al actualizar información:', error);
      toast.error(error?.message || 'Error al actualizar información');
    },
  });
}