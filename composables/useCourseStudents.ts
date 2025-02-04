import { useQuery } from '@tanstack/vue-query'
import { apiRoutes, get } from '~/services/routes.api'

export function useCourseStudents(courseId: string | number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courseStudents', courseId],
    queryFn: () => get(apiRoutes.course.getStudents(courseId.toString())),
    enabled: !!courseId
  })

  return {
    students: data,
    isLoading,
    error,
    refetch
  }
} 