/* import axios from 'axios';
import axiosInstance from "./axios.config";

interface MultimediaBlockVideo {
    video: string | null;
    script: string;
    cover: string | null;
}

export class MultimediaBlockVideoApi {
    async getAll(): Promise<MultimediaBlockVideo[]> {
        try {
            const response = await axiosInstance.get("multimediablockvideos/");
            return response.data;
        } catch (error: any) {
            console.error("Error details:", error.response?.data);
            throw error;
        }
    }

    async getById(id: number): Promise<MultimediaBlockVideo> {
        try {
            const response = await axiosInstance.get(`multimediablockvideos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching multimedia block video:', error);
            throw error;
        }
    }

    async create(data: FormData): Promise<MultimediaBlockVideo> {
        try {
            const response = await axiosInstance.post('multimediablockvideos', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating multimedia block video:', error);
            throw error;
        }
    }

    async update(id: number, data: FormData): Promise<MultimediaBlockVideo> {
        try {
            const response = await axiosInstance.put(`multimediablockvideos/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating multimedia block video:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await axiosInstance.delete(`multimediablockvideos/${id}`);
        } catch (error) {
            console.error('Error deleting multimedia block video:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const multimediaBlockVideoApi = new MultimediaBlockVideoApi(); */
import axiosInstance from "./axios.config";

interface MultimediaBlockVideo {
    video: string | null;
    script: string;
    cover: string | null;
}




export class ApiMultimediaBlockVideoService {
  async createMultimediaBlockVideo(formData: MultimediaBlockVideo) {
    console.log(formData);
    try {
      const response = await axiosInstance.post("multimediablockvideos/", formData, {
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
  async getAllMultimediaBlockVideos() {
    try {
      const response = await axiosInstance.get(`multimediablockvideos/`);
      return response.data;
    } catch (error) {
      console.error("Error in getAllClasses:", error);
      throw error;
    }
  }

  // Obtener una clase por ID
  async getMultimediaBlockVideoById(id: number) {
    try {
      const response = await axiosInstance.get(`multimediablockvideos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in getClassById:", error);
      throw error;
    }
  }

  // Actualizar una clase
  async updateMultimediaBlockVideo(id: number, formData: MultimediaBlockVideo) {
    try {
      const response = await axiosInstance.put(`multimediablockvideos/${id}`, {
        formData,
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateClass:", error);
      throw error;
    }
  }

  // Eliminar una clase
  async deleteMultimediaBlockVideo(id: number) {
    try {
      const response = await axiosInstance.delete(`multimediablockvideos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteMultimediaBlockVideo:", error);
      throw error;
    }
  }
}

