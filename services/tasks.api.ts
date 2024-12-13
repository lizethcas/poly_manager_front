import axiosInstance from './axios.config';

class TasksApiService {
    async createLayout(classId: number, layoutData: FormData) {
        console.log('Creating layout for class:', classId);
        const response = await axiosInstance.post('layouts/', layoutData);
        return response.data;
    }

    async createMultipleChoiceTask(layoutId: number, taskData: any) {
        console.log('Creating multiple choice task for layout:', layoutId);
        const data = {
            layout: layoutId,
            ...taskData
        };
        const response = await axiosInstance.post('multiplechoice/', data);
        return response.data;
    }

    async createtrue_falseTask(layoutId: number, taskData: any) {
        console.log('Creating true/false task for layout:', layoutId);
        const data = {
            layout: layoutId,
            ...taskData
        };
        const response = await axiosInstance.post('trueorfalse/', data);
        return response.data;
    }

    async createOrderingTask(taskData: any) {
        console.log('Creando tarea ordering:', taskData);
        const response = await axiosInstance.post('orderingtasks/', taskData);
        return response.data;
    }

    async createCategoriesTask(taskData: any) {
        console.log('Creando tarea categories:', taskData);
        const response = await axiosInstance.post('categoriestasks/', taskData);
        return response.data;
    }

    async createFillGapsTask(taskData: any) {
        console.log('Creando tarea fill gaps:', taskData);
        const response = await axiosInstance.post('fillinthegaps/', taskData);
        return response.data;
    }
}

export default new TasksApiService(); 