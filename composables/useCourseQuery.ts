import { useQuery } from "@tanstack/vue-query";
import { apiRoutes, get } from "@/services/routes.api";
import { useRoute } from "vue-router";

export const useCoursesQuery = (studentId?: string) => {
  const route = useRoute();

  const fetchCourses = async () => {
    try {
      // If studentId is provided, use student-specific endpoint
      // If not, use general courses endpoint
      const endpoint = studentId 
        ? apiRoutes.students.getCourseByStudent(studentId)
        : apiRoutes.courses;

      const response = await get(endpoint);

      if (!response) {
        throw new Error("No courses found");
      }
      return response;
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["courses", studentId],
    queryFn: fetchCourses,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
