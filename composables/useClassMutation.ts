import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes } from "~/services/routes.api";
import axiosInstance from "~/services/axios.config";

export const useClassMutation = () => {
  const queryClient = useQueryClient();

  const createClassMutation = async (classData: any) => {
    const response = await axiosInstance.post(apiRoutes.classes.getByCourseId(classData.course_id), classData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: createClassMutation,
    onMutate: async (newClass) => {
      const courseId = newClass.course_id;
      await queryClient.cancelQueries({ queryKey: ["classes", courseId] });

      const previousClasses = queryClient.getQueryData(["classes", courseId]);

      queryClient.setQueryData(["classes", courseId], (old: any[] = []) => {
        const optimisticClass = {
          ...newClass,
          id: "temp-" + Date.now(),
          imageUrl: URL.createObjectURL(newClass.cover),
        };
        return [...old, optimisticClass];
      });

      return { previousClasses, courseId };
    },
    onError: (err, newClass, context) => {
      if (context?.courseId) {
        queryClient.setQueryData(["classes", context.courseId], context.previousClasses);
      }
    },
    onSettled: (_, newClass) => {
      if (newClass?.course_id) {
        queryClient.invalidateQueries({ queryKey: ["classes", newClass.course_id] });
      }
    },
  });
}; 