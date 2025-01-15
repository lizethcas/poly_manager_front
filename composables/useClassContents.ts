import { ref } from 'vue'
import axiosInstance from '~/services/axios.config'

export function useClassContents(classId: string) {
  const classContents = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const fetchClassContents = async () => {
    try {
      isLoading.value = true
      const response = await axiosInstance.get(`/class-contents/?class_id=${classId}`)
      console.log('Respuesta completa del servidor:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      })
      classContents.value = response.data
    } catch (e) {
      console.error('Error detallado:', {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status
      })
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  // Ejecutar la función inmediatamente
  fetchClassContents()

  return {
    classContents,
    isLoading,
    error
  }
}