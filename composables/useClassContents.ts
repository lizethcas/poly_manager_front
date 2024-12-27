import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "~/services/axios.config";
import { apiRoutes } from "~/services/routes.api";

export const useClassContents = (classId: string | string[]) => {
  const {
    data: classContents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["class-contents", classId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${apiRoutes.classContent}?class_id=${classId}`
      );
      return response.data;
    },
  });

  return {
    classContents,
    isLoading,
    error,
  };
}; 