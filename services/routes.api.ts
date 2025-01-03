// routes/apiRoutes.js
import { axiosDashboard } from "./axios.config";

export const apiRoutes = {
  classContent: "class-contents/",
  courses: "courses/",
  classes: {
    getByCourseId: (courseId: string | string[]) =>
      `/classes/?courseId=${courseId}`,
    create: `classes/`,
    delete: (classId: number) => `classes/${classId}/`,
  },
};

export const get = async (route: string) => {
  const response = await axiosDashboard.get(route);
  return response.data;
};

export const del = async (url: string) => {
  return await axiosDashboard.delete(url);
};
