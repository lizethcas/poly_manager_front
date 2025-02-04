// routes/apiRoutes.js
import { axiosDashboard } from "./axios.config";

export const apiRoutes = {
  login: "login/",
  loginGoogle: "google-login/",
  logout: "logout/",
  register: "register/",
  registerTeacher: "teachers/",
  chat: {
    chatAi: "chat-ai/",
  },
  students: {
    getCourseByStudent: (id: string) => `students/${id}/courses/`,
    enrollCourse: (courseId: string) => `students/${courseId}/courses/enroll/`,
  },
  scenarios: {
    getAll: "scenarios/",
    create: "scenarios/",
    getById: (id: string) => `scenarios/${id}/`,
    delete: (id: string) => `scenarios/${id}/`,
  },
  classContent: "class-contents/",
  courses: "courses/",
  course: {
    getById: (courseId: string | string[]) => `/courses/?courseId=${courseId}`,
    update: (courseId: string | string[]) => `/courses/${courseId}/`,
    delete: (courseId: string | string[]) => `courses/${courseId}/`,
    getStudents: (courseId: string | string[]) =>
      `/courses/${courseId}/students/`,
  },
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
  console.log("DATA enviada:", data);
  const response = await axiosDashboard.post(route, data);
  return response.data;
};

export const patch = async (route: string, data: any) => {
  const response = await axiosDashboard.patch(route, data);
  return response.data;
};
