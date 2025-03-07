import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes } from "~/services/routes.api";
import { axiosDashboard } from "~/services/axios.config";
import { useNotify } from "~/composables/useNotify";

export const useCourseMutation = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotify();

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      console.log("Creating course with data:", courseData);

      const response = await axiosDashboard.post(
        apiRoutes.courses,
        courseData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    },
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

  const updateCourseMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: number;
      formData: FormData;
    }) => {
      const response = await axiosDashboard.patch(
        apiRoutes.course.update(id.toString()),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      success("Course updated successfully");
      
      // Force refetch all course-related queries
      queryClient.resetQueries({ queryKey: ["courses"] });
      
      // If you have specific course queries with ID
      queryClient.resetQueries({ queryKey: ["courses", variables.id] });
      
      // For any other potentially related queries
      queryClient.resetQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && 
                 (queryKey[0] === "courses" || 
                  (queryKey.length > 1 && queryKey[1] === variables.id));
        }
      });
    },
    onError: (err) => {
      showError("Error updating course");
      console.error("Update error:", err);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return await axiosDashboard.delete(
        apiRoutes.course.delete(courseId.toString())
      );
    },
    onSuccess: () => {
      success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      showError("Error deleting course");
      console.error("Delete error:", err);
    },
  });

  return {
    createCourseMutation,
    updateCourseMutation,
    deleteCourseMutation,
  };
};
