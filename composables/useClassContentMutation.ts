import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiRoutes } from '~/services/routes.api'
import axiosInstance from '~/services/axios.config'

export function useClassContentMutation() {
  const queryClient = useQueryClient()
  const route = useRoute()

  const createClassContentMutation = async (formData: FormData) => {
    try {
      console.log('Sending FormData:', Object.fromEntries(formData.entries()));

      const response = await axiosInstance.post(
        apiRoutes.classContent,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      
      console.log("Raw API Response:", response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createClassContentMutation,
    onMutate: async (newContent) => {
      const classId = route.params.classId;
      await queryClient.cancelQueries({ queryKey: ['class-contents', classId] });

      const previousContents = queryClient.getQueryData(['class-contents', classId]);

      queryClient.setQueryData(['class-contents', classId], (old: any[] = []) => {
        return [...old, newContent];
      });

      return { previousContents };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['class-contents', route.params.classId], context?.previousContents);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['class-contents', route.params.classId]);
    },
    onSuccess: (data) => {
      // Handle success
    },
  });

  return mutation;
} 