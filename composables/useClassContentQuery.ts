import { ref } from 'vue'
import { apiRoutes, get } from "@/services/routes.api"; 

export const useClassContentQuery = (classId: string) => {
  const data = ref(null)
  const isPending = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    try {
      isPending.value = true
      const response = await get(apiRoutes.classContent + classId)
      data.value = response
    } catch (err) {
      error.value = err
    } finally {
      isPending.value = false
    }
  }

  // Fetch data immediately when composable is used
  fetchData()

  return {
    data,
    isPending,
    error
  }
} 