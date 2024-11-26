import axiosInstance from "./axios.config";

export class TasksApiService {
  async createLayout(classId: number, layoutData: FormData) {
    try {
      const response = await axiosInstance.post(`layouts/`, {
        class_model: classId,
        ...layoutData
      });
      return response.data;
    } catch (error) {
      console.error("Error creating layout:", error);
      throw error;
    }
  }

  async createTask(layoutId: number, taskData: any, taskType: string) {
    try {
      const endpoints = {
        multipleChoice: 'multiplechoice',
        trueFalse: 'trueorfalse',
        ordering: 'orderingtasks',
        categories: 'categoriestasks',
        fillGaps: 'fillinthegaps'
      };

      const response = await axiosInstance.post(`${endpoints[taskType]}/`, {
        layout: layoutId,
        ...taskData
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating ${taskType} task:`, error);
      throw error;
    }
  }
}

export default new TasksApiService(); 