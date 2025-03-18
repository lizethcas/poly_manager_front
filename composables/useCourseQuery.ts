import { useQuery } from "@tanstack/vue-query";
import { apiRoutes, get } from "@/services/routes.api";

export const useCoursesQuery = (studentId?: string) => {
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

export const useClassesByCourseIdQuery = (courseId: string) => {
  const fetchClassesByCourseId = async () => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }
    const response = await get(apiRoutes.course.getClassesByCourseId(courseId));
    console.log(response);
    return response;
  };

  return useQuery({
    queryKey: ["classes", courseId],
    queryFn: fetchClassesByCourseId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
