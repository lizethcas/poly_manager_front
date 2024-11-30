import { defineStore } from "pinia";
import type { ClassData } from "~/interfaces/models/class.interface..model";

export const useClassStore = defineStore("class", {
  state: () => ({
    classes: [] as ClassData[],
    currenClass: null as ClassData | null, // null si no hay clase activa
    loading: false,
  }),
  persist: true,
  actions: {
    saveClass(courseData: ClassData) {
      this.currenClass = courseData as ClassData;
    },

    setClasses(classes: ClassData[]) {
      this.classes = classes;
    },

    updateCurrenClass(updates: Partial<ClassData>) {
      if (this.currenClass) {
        this.currenClass = {
          ...this.currenClass,
          ...(updates as ClassData),
        } as ClassData;
      }
    },
  },
});
