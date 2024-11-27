import axiosInstance from "./axios.config";
import type { ClassData } from "~/interfaces/models/class.interface..model";

export class ApiClassService {
  async createClass(formData: FormData) {
    try {
      // Verificar el contenido del FormData antes de enviarlo
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]); // Debug
      }

      const response = await axiosInstance.post("classes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error details:", error.response?.data); // Ver detalles del error
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
