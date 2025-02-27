export const createCourse = {
  title: "Create Course",
  showExtraElements: true,
  categorys: ["General English", "Business English", "ESP"],
  levels: ["A0. True Beginner",  "A1. Elementary", "A2. Pre-Intermediate", "B1. Intermediate", "B2. Upper Intermediate"],
  label_select: ["category:", "level:"],
  buttonText: "Create Course",
};

export const createClass = {
  title: "Create a new Class",
  showExtraElements: false,
  buttonText: "Create Class",
};

export const labels = [
  {
    id: 1,
    label_name: "Course Name:",
    field_name: "name",
    type: "text",
    getLabelName(title: string) {
      return title === "Create a new Class" ? "Class Name:" : "Course Name:";
    }
  },
  

  {
    id: 3,
    label_name: "Description:",
    field_name: "description",
    type: "text_area",
  },
  
];
