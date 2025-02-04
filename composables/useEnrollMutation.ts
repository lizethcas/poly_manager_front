import { useMutation } from "@tanstack/vue-query";
import { apiRoutes, post } from "~/services/routes.api";
import { useToast } from "vue-toastification";
export const useEnrollMutation = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: (courseId: string) => {
      return post(apiRoutes.students.enrollCourse(courseId), {
        course_id: courseId,
      });
    },
    onSuccess: () => {
      // You can add success handling here
      toast.success("Successfully enrolled in course");
    },

    onError: (error) => {
      // You can add error handling here
      console.error(error);
      toast.error(error.response.data.message);
    },
  });
};
