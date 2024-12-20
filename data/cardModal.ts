export const createCourse = {
  title: "Create Course",
  showExtraElements: true,
  categorys: ["General English", "Business English", "ESP"],
  levels: ["A0. True Beginner", "A1. Beginner", "A2. Elementary", "B1. Intermediate", "B2. Upper Intermediate", "C1. Advanced", "C2. Proficient"],
  label_select: ["category:", "level:"],
};

export const createClass = {
  title: "Create Class",
  showExtraElements: false,
};

export const labels = [
  {
    id: 1,
    label_name: "Course Name ",
    type: "text",
  },
  {
    id: 2,
    label_name: "Description",
    type: "text_area",
  }
];
