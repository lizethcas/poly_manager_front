import { useQuery } from "@tanstack/vue-query";
import { apiRoutes, get } from "@/services/routes.api";

export const useClassesQuery = (courseId: string) => {
  const fetchClasses = async () => {
    try {
      const response = await get(apiRoutes.classes.getByCourseId(courseId));
      if (!response) {
        throw new Error("No classes found");
      }

      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["classes", courseId],
    queryFn: fetchClasses,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
