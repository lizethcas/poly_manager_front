import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiRoutes } from '~/services/routes.api'
import { axiosDashboard } from '~/services/axios.config'

export function useClassContentMutation() {
  const queryClient = useQueryClient()
  const route = useRoute()

  const createClassContentMutation = async (data: any) => {
    try {
      const isFormData = data instanceof FormData;
      
      // Convert FormData to object and log all data together
      if (isFormData) {
        const formDataObject = {};
        for (const pair of data.entries()) {
          formDataObject[pair[0]] = pair[1];
        }
        console.log('Data being sent:', formDataObject);
      } else {
        console.log('Data being sent:', data);
      }

      const response = await axiosDashboard.post(
        apiRoutes.classContent,
        data,
        {
          headers: isFormData ? {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          } : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response.data)
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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['class-contents', classId] });

      // Snapshot the previous value
      const previousContents = queryClient.getQueryData(['class-contents', classId]);

      // Optimistically update with proper index
      if (previousContents) {
        queryClient.setQueryData(['class-contents', classId], (old: any) => {
          if (!Array.isArray(old)) {
            return [old];
          }
          const newIndex = old.length;
          return [...old, newContent];
        });
      }

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

  const deleteMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await axiosDashboard.delete(apiRoutes.classContents.delete(contentId))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-contents', route.params.classId] })
    }
  })

  return {
    create: mutation,
    delete: deleteMutation
  }
} 