// routes/apiRoutes.js
import { axiosDashboard } from "./axios.config";

export const apiRoutes = {
  chat: {
    chatAi: "chat-ai/",
  },
  scenarios: {
    getAll: "scenarios/",
    create: "scenarios/",
    getById: (id: string) => `scenarios/${id}/`,
  },
  classContent: "class-contents/",
  courses: "courses/",
  classes: {
    getByCourseId: (courseId: string | string[]) =>
      `/classes/?courseId=${courseId}`,
    getById: (classId: number) => `classes/${classId}/`,
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

export const post = async (route: string, data: any) => {
  const response = await axiosDashboard.post(route, data);
  return response.data;
};


