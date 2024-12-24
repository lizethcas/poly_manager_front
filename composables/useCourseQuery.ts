import { useQuery } from '@tanstack/vue-query'
import { apiRoutes, get } from '@/services/routes.api'

export const useCoursesQuery = () => {
  const fetchCourses = async () => {
    try {
      const response = await get(apiRoutes.courses)
      if (!response) {
        throw new Error('No courses found')
      }
      console.log('Courses fetched:', response)
      return response
    } catch (error: any) {
      console.error('Error fetching courses:', error)
      throw error
    }
  }

  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}