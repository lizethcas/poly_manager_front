import { useQuery } from "@tanstack/vue-query";
import { axiosDashboard } from "~/services/axios.config";
import { apiRoutes } from "~/services/routes.api";

export const useClassContents = (classId: string | string[]) => {
  const {
    data: classContents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["class-contents", classId],
    queryFn: async () => {
      const response = await axiosDashboard.get(
        `${apiRoutes.classContent}?class_id=${classId}`
      );
      // Check if response.data has a 'data' property (common API structure)
      const contents = Array.isArray(response.data) ? response.data : response.data.data;
      
      if (!Array.isArray(contents)) {
        throw new Error('Invalid response format: expected an array');
      }

      return {
        data: contents.map((content: any, index: number) => ({
          ...content,
          index
        }))
      };
    },
  });

  return {
    classContents,
    isLoading,
    error,
  };
}; 