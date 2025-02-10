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
      
      // Better type handling and data extraction
      const contents = Array.isArray(response.data?.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
          ? response.data 
          : [];

      return {
        data: contents.map((content: any, index: number) => ({
          ...content,
          index // Use the map index directly for better reliability
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