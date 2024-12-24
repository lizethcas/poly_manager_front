import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes } from "~/services/routes.api";
import axiosInstance from "~/services/axios.config";

export const useCourseMutation = () => {
  const queryClient = useQueryClient();

  const createCourseMutation = async (courseData: any) => {
    console.log('Course data:', courseData)
    const response = await axiosInstance.post(apiRoutes.courses, courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    console.log('Course created:', response.data)
    return response.data;
  };

  return useMutation({
    mutationFn: createCourseMutation,
    onMutate: async (newCourse) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(["courses"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["courses"], (old: any[] = []) => {
        const optimisticCourse = {
          ...newCourse,
          id: "temp-" + Date.now(), // temporary ID
          imageUrl: URL.createObjectURL(newCourse.cover),
          lessonCount: 0,
        };
        return [...old, optimisticCourse];
      });

      // Return a context object with the snapshotted value
      return { previousCourses };
    },
    onError: (err, newCourse, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["courses"], context?.previousCourses);
    },
    onSettled: () => {
      // Always refetch after error or success to get the correct server
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
