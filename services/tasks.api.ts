import axiosInstance from "./axios.config";

export class TasksApiService {
  async createLayout(classId: number, layoutData: FormData) {
    try {
      console.log('Creating layout for class:', classId);
      
      const response = await axiosInstance.post('layouts/', layoutData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating layout:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      throw error;
    }
  }

  async createTask(layoutId: number, taskData: any, taskType: string) {
    try {
      const endpoints = {
        multipleChoice: 'multiplechoice/',
        trueFalse: 'trueorfalse/',
        ordering: 'orderingtasks/',
        categories: 'categoriestasks/',
        fillGaps: 'fillinthegaps/'
      };

      console.log(`Creating ${taskType} task with data:`, taskData);

      const response = await axiosInstance.post(endpoints[taskType], taskData);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${taskType} task:`, error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      throw error;
    }
  }
}

export default new TasksApiService(); 