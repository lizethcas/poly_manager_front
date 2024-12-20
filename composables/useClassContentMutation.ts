import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiRoutes } from '~/services/routes.api'
import axiosInstance from '~/services/axios.config'
import { computed } from 'vue'

export function useClassContentMutation() {
  const queryClient = useQueryClient()
  const route = useRoute()

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Agregar datos básicos
      formData.append('class_model', data.class_model);
      formData.append('content_type', data.content_type);
      formData.append('tittle', data.tittle);
      formData.append('instructions', data.instructions);
      
      // Manejar archivos multimedia
      data.multimedia.forEach((item: any, index: number) => {
        if (item.file) {
          // Crear nombre de archivo sin espacios
          const newFileName = item.file.name.replace(/\s+/g, '_');
          const newFile = new File([item.file], newFileName, { type: item.file.type });
          
          formData.append(`multimedia[${index}][media_type]`, item.media_type);
          formData.append(`multimedia[${index}][file]`, newFile);
          
          if (item.transcription) {
            formData.append(`multimedia[${index}][transcription]`, item.transcription);
          }
        }
      });

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
      console.log("response", response.data);
      return response.data;
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