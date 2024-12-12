// hooks/useMultipleChoice.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import axiosInstance from './axios.config';
import { apiRoutes } from './routes.api';

export const useMultipleChoice = () => {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => axiosInstance.post(apiRoutes.multiplechoice, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.multiplechoice] });
    },
    onError: (error) => {
      console.error('Error saving multiple choice task:', error);
    }
  });

  const { data: multipleTasksData = [], isLoading, isError, error } = useQuery({
    queryKey: [apiRoutes.multiplechoice],
    queryFn: async () => {
      const response = await axiosInstance.get(apiRoutes.multiplechoice);
      return response.data ?? [];
    },
    retry: 1,
    staleTime: 5000
  });

  return {
    save: saveMutation.mutate,
    data: multipleTasksData,
    isLoading,
    isError,
    error,
    isSaving: saveMutation.isLoading,
    isSuccess: saveMutation.isSuccess,
    saveError: saveMutation.error
  };
};
