import { useQuery } from '@tanstack/vue-query';
import { get } from '~/services/routes.api';
import { apiRoutes } from '~/services/routes.api';
import { ref } from 'vue';

export interface Student {
  id: string;
  user_username: string;
  surname: string;
  email: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  // Agrega más campos según tu modelo de datos
}

export function useStudentQuery(studentId: string) {
  const enabled = ref(!!studentId);

  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      const response = await get(apiRoutes.students.getById(studentId));
    

      return response.data as Student;
    },
    enabled,
    refetchOnWindowFocus: false, // No recargar al enfocar la ventana
    staleTime: 0, // Considerar los datos siempre obsoletos para forzar la actualización// Mantener en caché durante 5 minutos
  });
}