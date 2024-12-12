import axiosInstance from "./axios.config";
import type { ClassData } from "~/interfaces/models/class.interface..model";

export class ApiClassService {
  async createClass(formData: FormData) {
    try {
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
    try {
      const response = await axiosInstance.get(`classes/`);
      return response.data;
    } catch (error) {
      console.error("Error in getAllClasses:", error);
      throw error;
    }
  }

  // Obtener una clase por ID
  async getClassById(id: number) {
    try {
      const response = await axiosInstance.get(`classes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in getClassById:", error);
      throw error;
    }
  }

  // Actualizar una clase
  async updateClass(id: number, formData: ClassData) {
    try {
      const response = await axiosInstance.put(`classes/${id}`, {
        formData,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateClass:", error);
      throw error;
    }
  }

  // Eliminar una clase
  async deleteClass(id: number) {
    try {
      const response = await axiosInstance.delete(`classes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteClass:", error);
      throw error;
    }
  }
}
