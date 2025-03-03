export const routes = {
  routesAdmin: {
    dashboard: "/admin/dashboard",
    courses: "/admin/courses",
    students: [
      "/admin/students",
      (courseId: string) => `/admin/course-${courseId}/students`,
    ],


    course: (courseId: string) => `/admin/course-${courseId}`,
    classes: (courseId: string) => `/admin/course-${courseId}/classes`,
    class: (courseId: string, classId: string) =>
      `/admin/course-${courseId}/class-${classId}`,
    statistics: (courseId: string) => `/admin/course-${courseId}/statistics`,
  },
  routesStudent: {
    classes: (courseId: string) => `/student-${courseId}/classes`,
    classByStudent: ( studentId: string) =>
      `/student-${studentId}/classes`,
    courses: "/student-${courseId}/courses",
    course: (courseId: string) => `/student-${courseId}/course-${courseId}`,
    progress: "/student/progress",
    totalStudentsbyCourse: (studentId: string) => `courses/${studentId}/students`,
    class: (courseId: string, classId: string) =>
      `/student/course-${courseId}/class-${classId}`,
  },
};

export const navigationRoutes = {
  // Admin routes
  admin: [
    {
      path: routes.routesAdmin.dashboard,
      name: "Dashboard",
      icon: "tabler:home",
      userType: "admin",
    },
    {
      path: routes.routesAdmin.courses,
      name: "Courses",
      icon: "material-symbols:menu-book-outline",
      userType: "admin",
    },
    {
      path: routes.routesAdmin.students,
      name: "Students",
      icon: "tabler:users",
      userType: "admin",
    },
    {
      path: routes.routesAdmin.classes,
      name: "Classes",
      icon: "tabler:home",
      userType: "admin",
    },
    {
      path: routes.routesAdmin.class,
      name: "Class",
      icon: "tabler:home",
      userType: "admin",
    },
  ],
  // Student routes
  student: [
    {
      path: routes.routesStudent.classes,
      name: "My classes",
      icon: "tabler:home",
      userType: "student",
    },
    {
      path: routes.routesStudent.courses,
      name: "My courses",
      icon: "material-symbols:menu-book-outline",
      userType: "student",
    },
    {
      path: routes.routesStudent.progress,
      name: "My progress",
      icon: "tabler:graph",
      userType: "student",
    },
  ],
};

// Add default export combining both exports
export default {
  routes,
  navigationRoutes,
};
