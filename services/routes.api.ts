// routes/apiRoutes.js
import axiosInstance from "./axios.config";

export const apiRoutes = {
  classContent: "class-contents/",
  courses: "courses/",

};

export const get = async (route: string) => {
  const response = await axiosInstance.get(route);
  return response.data;
};
