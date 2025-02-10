import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes, get, del } from "@/services/routes.api";

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

  const queryClient = useQueryClient();

  const deleteClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      const response = await del(apiRoutes.classes.delete(classId));

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the classes query
      queryClient.invalidateQueries({ queryKey: ["classes", courseId] });
    },
  });

  return {
    // Return existing query
    ...useQuery({
      queryKey: ["classes", courseId],
      queryFn: fetchClasses,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    }),
    // Add the delete mutation
    deleteClass: deleteClassMutation.mutate,
    isDeletingClass: deleteClassMutation.isPending,
  };
};

export const useClassByIdQuery = (classId: number) => {
  const fetchClassById = async () => {
    try {
      const response = await get(apiRoutes.classes.getById(classId));
      if (!response) {
        throw new Error("Class not found");
      }
      return response;
    } catch (error: any) {
      console.error("Error fetching class:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: [ "class", classId],
    queryFn: fetchClassById,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
