import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { apiRoutes } from "~/services/routes.api";
import { axiosDashboard } from "~/services/axios.config";
const { success, error } = useNotify();
export const useClassMutation = () => {
  const queryClient = useQueryClient();

  const createClassMutation = async (classData: any) => {
    const response = await axiosDashboard.post(apiRoutes.classes.getByCourseId(classData.course_id), classData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const updateClassMutation = async ({ id, formData }: { id: number; formData: FormData }) => {
    const response = await axiosDashboard.patch(apiRoutes.classes.getById(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const updateMutation = useMutation({
    mutationFn: updateClassMutation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", variables.id] });
      success("Class updated successfully");
    },
    onError: (err) => {
      error("Error updating class");
    },
  });

  return {
    createClassMutation: useMutation({
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
        error("Error creating class");
      },
      onSettled: (_, newClass) => {
        if (newClass?.course_id) {
          queryClient.invalidateQueries({ queryKey: ["classes", newClass.course_id] });
        }
      },
    }),
    updateClassMutation: updateMutation,
  };
}; 