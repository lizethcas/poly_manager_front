import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiRoutes } from '~/services/routes.api'
import axiosInstance from '~/services/axios.config'
import { computed } from 'vue'

export function useClassContentMutation() {
  const queryClient = useQueryClient()
  const route = useRoute()

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosInstance.post(apiRoutes.classContent, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        console.log("response", response.data);
        return response.data
      } catch (error) {
        console.error('API Error Details:', error.response?.data)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the class contents query
      queryClient.invalidateQueries(['class-contents', route.params.classId])
    },
  })

  return {
    mutation,
    isLoading: computed(() => mutation.isPending),
    isSuccess: computed(() => mutation.isSuccess),
    isError: computed(() => mutation.isError),
    error: computed(() => mutation.error),
  }
} 