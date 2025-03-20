// routes/apiRoutes.js
import { axiosDashboard } from "./axios.config";

export const apiRoutes = {
  search: (query: string, studentId?: string) =>
    `search/?q=${encodeURIComponent(query)}${studentId ? `&student_id=${studentId}` : ''}`,
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
    enrollCourse: (studentId: string) => `students/${studentId}/courses/enroll/`,
    getClassesByStudent: (studentId: string) =>
      `students/${studentId}/classes`,
    getById: (studentId: string) => `students/${studentId}/`,
    update: (studentId: string) => `students/${studentId}/`,  
  },
  scenarios: {
    getAll: "scenarios/",
    create: "scenarios/",
    getById: (id: string) => `scenarios/${id}/`,
    delete: (id: string) => `scenarios/${id}/`,
  },
  classContent: "class-contents/",
  classContents: {
    delete: (id: string) => `class-contents/${id}/`,
    update: (id: string) => `class-contents/${id}/`,
  },

  courses: "courses/",
  course: {
    getById: (courseId: string | string[]) => `/courses/?courseId=${courseId}`,
    update: (courseId: string | string[]) => `/courses/${courseId}/`,
    delete: (courseId: string | string[]) => `courses/${courseId}/`,
    getStudents: (courseId: string | string[]) =>
      `/courses/${courseId}/students/`,
    getClassesByCourseId: (courseId: string | string[]) =>
      `/courses/${courseId}/classes/`,
  },
  classes: {
    update: (classId: number) => `classes/${classId}/`,
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

export const patch = async (route: string, data: any, config = {}) => {
  const response = await axiosDashboard.patch(route, data, config);
  return response.data;
};
