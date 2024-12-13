// routes/apiRoutes.js
import axiosInstance from "./axios.config";

export const apiRoutes = {

  multimediaBlockVideos: "multimediablockvideos/",
  orderingtasks: "orderingtasks/",
};

export const get = async (route: string) => {
  const response = await axiosInstance.get(route);
  return response.data;
};
