import { useQuery } from '@tanstack/vue-query'
import { apiRoutes, get } from '~/services/routes.api'
import { defineComponent } from 'vue'

export function useCourseStudents(courseId: string | number) {
  const courseStudents = defineComponent({
    setup() {
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
  })

  return courseStudents
} 