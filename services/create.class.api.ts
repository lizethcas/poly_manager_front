import axiosInstance from "./axios.config";
import type { ClassData } from "~/interfaces/class.interface";

export class ApiClassService {
  async createClass(formData: FormData) {
    try {
      const response = await axiosInstance.post("courses/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in createCourse:", error);
      throw error;
    }
  }

  // Obtener todas las clases
  async getAllClasses() {
    const response = await axiosInstance.get(`classes`);
    return response;
  }

  // Obtener una clase por ID
  async getClassById(id: number) {
    const response = await axiosInstance.get(`classes/${id}`);
    return response;
  }

  // Actualizar una clase
  async updateClass(id: number, formData: ClassData) {
    const response = await axiosInstance.put(`classes/${id}`, {
      body: {
        img_cover: formData.img_cover,
        lesson_name: formData.lesson_name,
        description: formData.description,
        course: formData.course_id,
        bullet_points: formData.bullet_points,
      },
    });
    return response;
  }

  // Eliminar una clase
  async deleteClass(id: number) {
    const response = await axiosInstance.delete(`classes/${id}`);
    return response;
  }
}
