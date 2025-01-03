// routes/apiRoutes.js
import axiosInstance from "./axios.config";

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
  const response = await axiosInstance.get(route);
  return response.data;
};

export const del = async (url: string) => {
  return await axiosInstance.delete(url);
};
