export const routes = {
  routesAdmin: {
    dashboard: "/admin/dashboard",
    courses: "/admin/courses",
    students: "/admin/students",
    course: (courseId: string) => `/admin/course/${courseId}`,
  },
  routesStudent: {
    classes: "/student/classes",
    courses: "/student/courses",
    course: (courseId: string) => `/student/course/${courseId}`,
    progress: "/student/progress",
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
